from fastapi import APIRouter
from src.controllers.inspection_task_controller import (
    create_inspection_task,
    list_inspection_task,
    reschedule_inspection_task,
)

router = APIRouter(prefix="/api/inspection-task", tags=["InspectionTask"])
router.get("")(list_inspection_task)
router.post("")(create_inspection_task)
# 退回排期的任务重新排期
router.post("/{task_id}/reschedule")(reschedule_inspection_task)
