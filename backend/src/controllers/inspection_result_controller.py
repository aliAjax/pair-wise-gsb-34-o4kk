from fastapi import Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.inspection_result_service import InspectionResultService


def list_inspection_result(
    task_id: int | None = None,
    device_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = InspectionResultService(db)
    return service.list(task_id, device_id)
