from fastapi import APIRouter
from src.controllers.inspection_task_controller import list_inspection_task, create_inspection_task
router = APIRouter(prefix="/api/inspection-task", tags=["InspectionTask"])
router.get("")(list_inspection_task)
router.post("")(create_inspection_task)
