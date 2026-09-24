from src.constants.device_type import DeviceType
from src.constants.device_status import DeviceStatus
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constructors.inspection_task_factory import create_inspection_task_dto
from src.constructors.inspection_result_factory import create_inspection_result_dto
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.building_repository import BuildingRepository
from src.utils.formatters import audit_target

class TaskError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(ERROR_MESSAGES.get(code, code))

class InspectionTaskService:
    def __init__(self):
        self.repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()
        self.building_repo = BuildingRepository()
    def list(self):
        return self.repo.find_all()
    def create(self, payload):
        payload = payload or {}
        building_id = payload.get("building_id")
        plan_date = str(payload.get("plan_date") or "").strip()
        task_type = payload.get("task_type")
        checklist_version = str(payload.get("checklist_version") or "weekly-v1").strip()
        if building_id is None or not plan_date:
            raise TaskError(ERROR_CODES["VALIDATION_FAILED"])
        if not any(b["id"] == building_id for b in self.building_repo.find_all()):
            raise TaskError(ERROR_CODES["VALIDATION_FAILED"])
        if task_type not in DeviceType:
            raise TaskError(ERROR_CODES["VALIDATION_FAILED"])
        devices = self.device_repo.find_by_building(building_id)
        active = [d for d in devices if d["status"] != DeviceStatus[1]]
        skipped = [d for d in devices if d["status"] == DeviceStatus[1]]
        task = create_inspection_task_dto(
            id=self.repo.next_id(),
            building_id=building_id,
            inspector_id=payload.get("inspector_id", 1),
            plan_date=plan_date,
            task_type=task_type,
            status="PLANNED",
            checklist_version=checklist_version,
            finished_at=""
        )
        self.repo.insert(task)
        for device in active:
            self.result_repo.insert(create_inspection_result_dto(
                id=self.result_repo.next_id(),
                task_id=task["id"],
                device_id=device["id"],
                item_code=f'{checklist_version}-{device["device_code"]}',
                result_status="PLANNED",
                measured_value="",
                photo_url="",
                note=""
            ))
        print(LOG_TEMPLATES["InspectionTask"][0], audit_target("InspectionTask", task["id"]))
        return {"task": task, "device_ids": [d["id"] for d in active], "skipped_device_ids": [d["id"] for d in skipped]}
