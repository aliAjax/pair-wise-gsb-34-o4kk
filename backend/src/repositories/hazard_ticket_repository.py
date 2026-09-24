from sqlalchemy import select

from src.models.hazard_ticket import HazardTicket
from src.repositories.base_repository import BaseRepository

# 已处理完等价于复验关闭
FINISHED_STATUSES = ("CLOSED",)


class HazardTicketRepository(BaseRepository):
    def find_all(self, device_id: int | None = None):
        stmt = select(HazardTicket)
        if device_id is not None:
            stmt = stmt.where(HazardTicket.device_id == device_id)
        return list(self.db.scalars(stmt.order_by(HazardTicket.id)).all())

    def find_unfinished_by_device(self, device_id: int):
        """设备关联且未处理完（非 CLOSED）的隐患。"""
        stmt = select(HazardTicket).where(HazardTicket.device_id == device_id)
        return [
            row
            for row in self.db.scalars(stmt).all()
            if row.rectify_status not in FINISHED_STATUSES
        ]
