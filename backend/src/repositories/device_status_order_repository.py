from sqlalchemy import select

from src.models.device_status_order import DeviceStatusOrder
from src.repositories.base_repository import BaseRepository


class DeviceStatusOrderRepository(BaseRepository):
    def find_all(self, device_id: int | None = None):
        stmt = select(DeviceStatusOrder).order_by(DeviceStatusOrder.id.desc())
        if device_id is not None:
            stmt = stmt.where(DeviceStatusOrder.device_id == device_id)
        return list(self.db.scalars(stmt).all())

    def find_by_id(self, order_id: int):
        return self.db.get(DeviceStatusOrder, order_id)

    def find_active_by_device(self, device_id: int):
        """该设备仍在流转中的单据（未驳回、未复启）。"""
        stmt = select(DeviceStatusOrder).where(
            DeviceStatusOrder.device_id == device_id,
            DeviceStatusOrder.state.in_(("PENDING", "DISABLED", "REACTIVATING")),
        )
        return list(self.db.scalars(stmt).all())

    def create(self, values: dict):
        row = DeviceStatusOrder(**values)
        self.db.add(row)
        self.db.flush()
        return row
