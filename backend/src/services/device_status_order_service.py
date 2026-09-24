from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.log_templates import LOG_TEMPLATES
from src.repositories.device_status_order_repository import DeviceStatusOrderRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.constructors.device_status_order_factory import create_device_status_order_dto
from src.services.audit_log_service import AuditLogService
from src.services.inspection_task_service import InspectionTaskService
from src.utils.errors import ServiceError
from src.utils.formatters import now_text

APPLY_ROLES = ("INSPECTOR", "MAINTAINER")
CONFIRM_ROLES = ("SUPERVISOR",)
CHECK_ROLES = ("INSPECTOR", "MAINTAINER", "SUPERVISOR")


class DeviceStatusOrderService:
    """报修停用 -> 主管确认停用 -> 复启补检 -> 隐患校验 -> 恢复在运。"""

    def __init__(self, db):
        self.db = db
        self.repo = DeviceStatusOrderRepository(db)
        self.device_repo = FireDeviceRepository(db)
        self.hazard_repo = HazardTicketRepository(db)
        self.task_service = InspectionTaskService(db)
        self.audit = AuditLogService(db)

    # ---------- 查询 ----------
    def list(self, device_id: int | None = None):
        device_codes = {row.id: row.device_code for row in self.device_repo.find_all()}
        return [
            create_device_status_order_dto(row, device_codes.get(row.device_id))
            for row in self.repo.find_all(device_id)
        ]

    def detail(self, order_id: int):
        row = self._get_order(order_id)
        device = self.device_repo.find_by_id(row.device_id)
        return create_device_status_order_dto(row, device.device_code if device else None)

    # ---------- 第一步：报修停用申请 ----------
    def apply(self, payload, user: dict):
        if user.get("role") not in APPLY_ROLES:
            raise ServiceError(ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403)
        device = self.device_repo.find_by_id(payload.device_id)
        if device is None:
            raise ServiceError(
                ERROR_CODES["DEVICE_NOT_FOUND"], ERROR_MESSAGES["DEVICE_NOT_FOUND"], 404
            )
        if self.repo.find_active_by_device(payload.device_id):
            raise ServiceError(
                ERROR_CODES["DEVICE_STATE_INVALID"],
                ERROR_MESSAGES["DEVICE_STATE_INVALID"],
                409,
            )
        row = self.repo.create({
            "device_id": payload.device_id,
            "state": "PENDING",
            "reason": payload.reason,
            "expected_recover_at": payload.expected_recover_at,
            "applicant_id": user.get("id"),
            "applicant_name": user.get("name") or user.get("role"),
            "applied_at": now_text(),
            "status_before": device.status,
            "status_after": device.status,
        })
        self.audit.record(
            user,
            LOG_TEMPLATES["DeviceStatusOrder"][0],
            "DeviceStatusOrder",
            row.id,
            f"提交停用申请：设备#{payload.device_id}，原因：{payload.reason}，"
            f"预计恢复：{payload.expected_recover_at}，状态 {device.status} → 待确认",
        )
        self.db.commit()
        return self.detail(row.id)

    # ---------- 第二步：主管确认停用 ----------
    def confirm(self, order_id: int, user: dict):
        if user.get("role") not in CONFIRM_ROLES:
            raise ServiceError(ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403)
        order = self._get_order(order_id)
        if order.state != "PENDING":
            raise ServiceError(
                ERROR_CODES["ORDER_STATE_INVALID"],
                ERROR_MESSAGES["ORDER_STATE_INVALID"],
                409,
            )
        device = self.device_repo.find_by_id(order.device_id)
        if device is None or device.status != "NORMAL":
            raise ServiceError(
                ERROR_CODES["DEVICE_STATE_INVALID"],
                ERROR_MESSAGES["DEVICE_STATE_INVALID"],
                409,
            )

        before = device.status
        device.status = "DISABLED"
        order.state = "DISABLED"
        order.confirmer_id = user.get("id")
        order.confirmer_name = user.get("name") or user.get("role")
        order.confirmed_at = now_text()
        order.status_before = before
        order.status_after = "DISABLED"

        # 未开始的任务剔除该设备；剔除后无设备的任务退回排期。已开始的任务不动。
        reason = f"设备#{device.id}({device.device_code})报修停用，退回排期"
        returned = self.task_service.remove_device_from_planned(device.id, reason, user)

        self.audit.record(
            user,
            LOG_TEMPLATES["DeviceStatusOrder"][1],
            "DeviceStatusOrder",
            order.id,
            f"主管确认停用设备#{device.id}，状态 {before} → DISABLED；"
            f"退回排期任务 {returned or '无'}",
        )
        self.db.commit()
        return self.detail(order.id)

    # ---------- 驳回 ----------
    def reject(self, order_id: int, payload, user: dict):
        if user.get("role") not in CONFIRM_ROLES:
            raise ServiceError(ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403)
        order = self._get_order(order_id)
        if order.state != "PENDING":
            raise ServiceError(
                ERROR_CODES["ORDER_STATE_INVALID"],
                ERROR_MESSAGES["ORDER_STATE_INVALID"],
                409,
            )
        order.state = "REJECTED"
        order.confirmer_id = user.get("id")
        order.confirmer_name = user.get("name") or user.get("role")
        order.confirmed_at = now_text()
        order.reject_reason = payload.reject_reason
        self.audit.record(
            user,
            LOG_TEMPLATES["DeviceStatusOrder"][2],
            "DeviceStatusOrder",
            order.id,
            f"停用申请被驳回：{payload.reject_reason}",
        )
        self.db.commit()
        return self.detail(order.id)

    # ---------- 第三步：复启前补检（结果异常时可在复启前重新补录） ----------
    def submit_check(self, order_id: int, payload, user: dict):
        if user.get("role") not in CHECK_ROLES:
            raise ServiceError(ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403)
        order = self._get_order(order_id)
        # DISABLED：首次补检；REACTIVATING：上次补检异常，修好后重新补检
        if order.state not in ("DISABLED", "REACTIVATING"):
            raise ServiceError(
                ERROR_CODES["ORDER_STATE_INVALID"],
                ERROR_MESSAGES["ORDER_STATE_INVALID"],
                409,
            )
        first_check = order.state == "DISABLED"
        order.state = "REACTIVATING"
        order.checker_id = user.get("id")
        order.checker_name = user.get("name") or user.get("role")
        order.checked_at = now_text()
        order.check_result = payload.result
        order.check_note = payload.note
        self.audit.record(
            user,
            LOG_TEMPLATES["DeviceStatusOrder"][3],
            "DeviceStatusOrder",
            order.id,
            f"{'首次' if first_check else '重新'}复启补检结果：{payload.result}"
            f"（{payload.note or '无备注'}）；设备保持停用，等待复启校验",
        )
        self.db.commit()
        return self.detail(order.id)

    # ---------- 第四步：结果正常且关联隐患处理完，恢复在运 ----------
    def reactivate(self, order_id: int, user: dict):
        if user.get("role") not in CONFIRM_ROLES:
            raise ServiceError(ERROR_CODES["RBAC_DENIED"], ERROR_MESSAGES["RBAC_DENIED"], 403)
        order = self._get_order(order_id)
        if order.state != "REACTIVATING":
            raise ServiceError(
                ERROR_CODES["ORDER_STATE_INVALID"],
                ERROR_MESSAGES["ORDER_STATE_INVALID"],
                409,
            )
        if order.check_result != "NORMAL":
            raise ServiceError(
                ERROR_CODES["CHECK_ABNORMAL"], ERROR_MESSAGES["CHECK_ABNORMAL"], 409
            )
        unfinished = self.hazard_repo.find_unfinished_by_device(order.device_id)
        if unfinished:
            raise ServiceError(
                ERROR_CODES["HAZARD_UNFINISHED"],
                f"{ERROR_MESSAGES['HAZARD_UNFINISHED']}（未关闭隐患 {len(unfinished)} 条）",
                409,
            )
        device = self.device_repo.find_by_id(order.device_id)
        if device is None:
            raise ServiceError(
                ERROR_CODES["DEVICE_NOT_FOUND"], ERROR_MESSAGES["DEVICE_NOT_FOUND"], 404
            )
        before = device.status
        device.status = "NORMAL"
        order.state = "REACTIVATED"
        order.reactivator_id = user.get("id")
        order.reactivator_name = user.get("name") or user.get("role")
        order.reactivated_at = now_text()
        order.status_before = before
        order.status_after = "NORMAL"
        self.audit.record(
            user,
            LOG_TEMPLATES["DeviceStatusOrder"][4],
            "DeviceStatusOrder",
            order.id,
            f"设备#{device.id}恢复在运，状态 {before} → NORMAL；补检正常且关联隐患均已关闭",
        )
        self.db.commit()
        return self.detail(order.id)

    def _get_order(self, order_id: int):
        row = self.repo.find_by_id(order_id)
        if row is None:
            raise ServiceError(
                ERROR_CODES["ORDER_NOT_FOUND"], ERROR_MESSAGES["ORDER_NOT_FOUND"], 404
            )
        return row
