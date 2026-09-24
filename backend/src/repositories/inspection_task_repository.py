from sqlalchemy import select

from src.models.inspection_task import InspectionTask
from src.repositories.base_repository import BaseRepository


def parse_device_ids(raw: str | None) -> list[int]:
    if not raw:
        return []
    return [int(part) for part in str(raw).split(",") if part.strip()]


class InspectionTaskRepository(BaseRepository):
    def find_all(self, status: str | None = None, building_id: int | None = None):
        stmt = select(InspectionTask)
        if status is not None:
            stmt = stmt.where(InspectionTask.status == status)
        if building_id is not None:
            stmt = stmt.where(InspectionTask.building_id == building_id)
        return list(self.db.scalars(stmt.order_by(InspectionTask.id)).all())

    def find_by_id(self, task_id: int):
        return self.db.get(InspectionTask, task_id)

    def find_planned_for_device(self, device_id: int):
        """未开始（PLANNED）且设备清单包含该设备的任务——停用确认时退回排期。"""
        rows = list(self.db.scalars(
            select(InspectionTask).where(InspectionTask.status == "PLANNED")
        ).all())
        return [row for row in rows if device_id in parse_device_ids(row.device_ids)]

    def create(self, values: dict):
        row = InspectionTask(**values)
        self.db.add(row)
        self.db.flush()
        return row
