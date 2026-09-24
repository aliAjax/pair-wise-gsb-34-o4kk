from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.log_templates import LOG_TEMPLATES
from src.repositories.inspection_task_repository import (
    InspectionTaskRepository,
    parse_device_ids,
)
from src.repositories.fire_device_repository import FireDeviceRepository
from src.constructors.inspection_task_factory import create_inspection_task_dto
from src.services.audit_log_service import AuditLogService
from src.utils.errors import ServiceError
from src.utils.formatters import join_device_ids, now_text


class InspectionTaskService:
    def __init__(self, db):
        self.db = db
        self.repo = InspectionTaskRepository(db)
        self.device_repo = FireDeviceRepository(db)
        self.audit = AuditLogService(db)

    def list(self, status: str | None = None, building_id: int | None = None):
        return [
            create_inspection_task_dto(row)
            for row in self.repo.find_all(status, building_id)
        ]

    def get(self, task_id: int):
        row = self.repo.find_by_id(task_id)
        if row is None:
            raise ServiceError(
                ERROR_CODES["TASK_NOT_FOUND"], ERROR_MESSAGES["TASK_NOT_FOUND"], 404
            )
        return create_inspection_task_dto(row)

    def create(self, payload, user: dict):
        """新建周巡检：只带入在运设备，停用设备不再排进任务。"""
        if payload.device_ids is not None:
            picked = [self.device_repo.find_by_id(i) for i in payload.device_ids]
            picked = [row for row in picked if row is not None]
        else:
            picked = self.device_repo.find_active_by_building(payload.building_id)
        active = [row for row in picked if row.status == "NORMAL"]

        row = self.repo.create({
            "building_id": payload.building_id,
            "inspector_id": payload.inspector_id,
            "plan_date": payload.plan_date,
            "task_type": payload.task_type,
            "status": "PLANNED",
            "checklist_version": payload.checklist_version,
            "finished_at": None,
            "device_ids": join_device_ids([row.id for row in active]),
            "return_reason": None,
        })
        self.audit.record(
            user,
            LOG_TEMPLATES["InspectionTask"][0],
            "InspectionTask",
            row.id,
            f"新建巡检计划，纳入在运设备 {row.device_ids or '(空)'}",
        )
        self.db.commit()
        return create_inspection_task_dto(row)

    def remove_device_from_planned(self, device_id: int, reason: str, user: dict):
        """停用确认联动：未开始任务剔除停用设备；剔除后无设备的任务退回排期。"""
        affected = self.repo.find_planned_for_device(device_id)
        returned = []
        for task in affected:
            remaining = [i for i in parse_device_ids(task.device_ids) if i != device_id]
            task.device_ids = join_device_ids(remaining)
            self.audit.record(
                user,
                LOG_TEMPLATES["InspectionTask"][4],
                "InspectionTask",
                task.id,
                f"任务剔除停用设备#{device_id}，剩余设备 {task.device_ids or '(空)'}",
            )
            if not remaining:
                task.status = "RETURNED"
                task.return_reason = reason
                returned.append(task.id)
                self.audit.record(
                    user,
                    LOG_TEMPLATES["InspectionTask"][5],
                    "InspectionTask",
                    task.id,
                    f"任务无可用设备，退回排期：{reason}",
                )
        return returned

    def reschedule(self, task_id: int, plan_date: str, user: dict):
        """退回排期的任务重新排期（复启后可再次纳入设备）。"""
        row = self.repo.find_by_id(task_id)
        if row is None:
            raise ServiceError(
                ERROR_CODES["TASK_NOT_FOUND"], ERROR_MESSAGES["TASK_NOT_FOUND"], 404
            )
        if row.status != "RETURNED":
            raise ServiceError(
                ERROR_CODES["ORDER_STATE_INVALID"],
                ERROR_MESSAGES["ORDER_STATE_INVALID"],
                409,
            )
        # 重新排期时补入该楼栋当前在运设备（去重）
        active = self.device_repo.find_active_by_building(row.building_id)
        merged = sorted(set(parse_device_ids(row.device_ids)) | {d.id for d in active})
        row.device_ids = join_device_ids(merged)
        row.plan_date = plan_date
        row.status = "PLANNED"
        row.return_reason = None
        self.audit.record(
            user,
            LOG_TEMPLATES["InspectionTask"][6],
            "InspectionTask",
            row.id,
            f"退回任务重新排期至 {plan_date}，设备 {row.device_ids}",
        )
        self.db.commit()
        return create_inspection_task_dto(row)
