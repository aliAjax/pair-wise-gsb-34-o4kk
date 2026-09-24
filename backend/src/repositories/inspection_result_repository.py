from sqlalchemy import select

from src.models.inspection_result import InspectionResult
from src.repositories.base_repository import BaseRepository


class InspectionResultRepository(BaseRepository):
    def find_all(self, task_id: int | None = None, device_id: int | None = None):
        stmt = select(InspectionResult)
        if task_id is not None:
            stmt = stmt.where(InspectionResult.task_id == task_id)
        if device_id is not None:
            stmt = stmt.where(InspectionResult.device_id == device_id)
        return list(self.db.scalars(stmt).all())
