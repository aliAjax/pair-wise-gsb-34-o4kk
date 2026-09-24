from datetime import datetime, timezone
from src.constants.device_status import DeviceStatus
from src.constants.outage_check_result import OutageCheckResult
from src.constants.rectify_status import RECTIFY_CLOSED
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constructors.device_outage_factory import create_device_outage_dto, create_device_outage_event
from src.repositories.device_outage_repository import DeviceOutageRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.utils.formatters import audit_target

SUPERVISOR_ROLES = ["admin", "supervisor"]

class OutageError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(ERROR_MESSAGES.get(code, code))

def _now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def _handler(user):
    user = user or {}
    return f'{user.get("role", "admin")}#{user.get("id", "?")}'

class DeviceOutageService:
    def __init__(self):
        self.repo = DeviceOutageRepository()
        self.device_repo = FireDeviceRepository()
        self.task_repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.hazard_repo = HazardTicketRepository()

    def list(self):
        return self.repo.find_all()

    def _get_or_raise(self, outage_id):
        row = self.repo.find_by_id(outage_id)
        if row is None:
            raise OutageError(ERROR_CODES["OUTAGE_NOT_FOUND"])
        return row

    def _require_supervisor(self, user):
        role = (user or {}).get("role", "admin")
        if role not in SUPERVISOR_ROLES:
            raise OutageError(ERROR_CODES["RBAC_DENIED"])

    def _open_hazards(self, device_id):
        result_ids = [r["id"] for r in self.result_repo.find_by_device(device_id)]
        return [h for h in self.hazard_repo.find_by_result_ids(result_ids) if h["rectify_status"] != RECTIFY_CLOSED]

    def apply(self, payload, user):
        device = self.device_repo.find_by_id((payload or {}).get("device_id"))
        if device is None:
            raise OutageError(ERROR_CODES["DEVICE_NOT_FOUND"])
        reason = str((payload or {}).get("reason") or "").strip()
        expected = str((payload or {}).get("expected_recovery_at") or "").strip()
        if not reason or not expected:
            raise OutageError(ERROR_CODES["VALIDATION_FAILED"])
        if device["status"] == "OUT_OF_SERVICE" or self.repo.find_active_by_device(device["id"]):
            raise OutageError(ERROR_CODES["DEVICE_BUSY"])
        row = create_device_outage_dto(
            id=self.repo.next_id(),
            device_id=device["id"],
            reason=reason,
            expected_recovery_at=expected,
            status="PENDING",
            applicant=_handler(user),
            applied_at=_now_iso(),
            device_status_before=device["status"],
            events=[create_device_outage_event(action="APPLY", handler=_handler(user), at=_now_iso(), from_status="", to_status="PENDING", note=reason)]
        )
        self.repo.insert(row)
        print(LOG_TEMPLATES["DeviceOutage"][0], audit_target("DeviceOutage", row["id"]))
        return row

    def confirm(self, outage_id, user):
        self._require_supervisor(user)
        row = self._get_or_raise(outage_id)
        if row["status"] != "PENDING":
            raise OutageError(ERROR_CODES["OUTAGE_STATE_INVALID"])
        device = self.device_repo.find_by_id(row["device_id"])
        if device is None:
            raise OutageError(ERROR_CODES["DEVICE_NOT_FOUND"])
        row["device_status_before"] = device["status"]
        self.device_repo.update_status(device["id"], "OUT_OF_SERVICE")
        planned_ids = [t["id"] for t in self.task_repo.find_planned()]
        protected = [h["result_id"] for h in self.hazard_repo.find_all()]
        removed = self.result_repo.delete_for_tasks(planned_ids, device["id"], protected)
        row["status"] = "DEACTIVATED"
        row["confirmer"] = _handler(user)
        row["confirmed_at"] = _now_iso()
        row["events"].append(create_device_outage_event(action="CONFIRM", handler=_handler(user), at=_now_iso(), from_status="PENDING", to_status="DEACTIVATED", note=f"设备停用，{removed} 项未开始任务退回排期"))
        print(LOG_TEMPLATES["DeviceOutage"][1], audit_target("DeviceOutage", row["id"]))
        return row

    def check(self, outage_id, payload, user):
        row = self._get_or_raise(outage_id)
        if row["status"] != "DEACTIVATED":
            raise OutageError(ERROR_CODES["OUTAGE_STATE_INVALID"])
        result = (payload or {}).get("result")
        if result not in OutageCheckResult:
            raise OutageError(ERROR_CODES["VALIDATION_FAILED"])
        note = str((payload or {}).get("note") or "").strip()
        row["check_result"] = result
        row["check_note"] = note
        row["checker"] = _handler(user)
        row["checked_at"] = _now_iso()
        verdict = "正常" if result == "NORMAL" else "异常"
        row["events"].append(create_device_outage_event(action="CHECK", handler=_handler(user), at=_now_iso(), from_status="DEACTIVATED", to_status="DEACTIVATED", note=f"复启检查：{verdict}。{note}".rstrip("。")))
        print(LOG_TEMPLATES["DeviceOutage"][2], audit_target("DeviceOutage", row["id"]))
        return row

    def recover(self, outage_id, user):
        self._require_supervisor(user)
        row = self._get_or_raise(outage_id)
        if row["status"] != "DEACTIVATED":
            raise OutageError(ERROR_CODES["OUTAGE_STATE_INVALID"])
        if row["check_result"] != "NORMAL":
            raise OutageError(ERROR_CODES["OUTAGE_CHECK_REQUIRED"])
        open_hazards = self._open_hazards(row["device_id"])
        if open_hazards:
            raise OutageError(ERROR_CODES["HAZARD_OPEN"])
        device = self.device_repo.find_by_id(row["device_id"])
        if device is None:
            raise OutageError(ERROR_CODES["DEVICE_NOT_FOUND"])
        restore = row["device_status_before"] if row["device_status_before"] in DeviceStatus and row["device_status_before"] != "OUT_OF_SERVICE" else "ACTIVE"
        self.device_repo.update_status(device["id"], restore)
        row["device_status_after"] = restore
        row["status"] = "RECOVERED"
        row["recoverer"] = _handler(user)
        row["recovered_at"] = _now_iso()
        row["events"].append(create_device_outage_event(action="RECOVER", handler=_handler(user), at=_now_iso(), from_status="DEACTIVATED", to_status="RECOVERED", note="检查正常且关联隐患已闭环，设备复启"))
        print(LOG_TEMPLATES["DeviceOutage"][3], audit_target("DeviceOutage", row["id"]))
        return row

    def cancel(self, outage_id, user):
        row = self._get_or_raise(outage_id)
        if row["status"] != "PENDING":
            raise OutageError(ERROR_CODES["OUTAGE_STATE_INVALID"])
        row["status"] = "CANCELLED"
        row["events"].append(create_device_outage_event(action="CANCEL", handler=_handler(user), at=_now_iso(), from_status="PENDING", to_status="CANCELLED", note="报修申请已取消"))
        print(LOG_TEMPLATES["DeviceOutage"][4], audit_target("DeviceOutage", row["id"]))
        return row
