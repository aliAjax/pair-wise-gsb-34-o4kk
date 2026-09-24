from fastapi import Depends, Request
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.inspection_task_service import InspectionTaskService
from src.types.inspection_task_payload import InspectionTaskCreatePayload, ReschedulePayload


def list_inspection_task(
    status: str | None = None,
    building_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = InspectionTaskService(db)
    return service.list(status, building_id)


def create_inspection_task(
    payload: InspectionTaskCreatePayload, request: Request, db: Session = Depends(get_db)
):
    service = InspectionTaskService(db)
    return service.create(payload, request.state.user)


def reschedule_inspection_task(
    task_id: int, payload: ReschedulePayload, request: Request, db: Session = Depends(get_db)
):
    service = InspectionTaskService(db)
    return service.reschedule(task_id, payload.plan_date, request.state.user)
