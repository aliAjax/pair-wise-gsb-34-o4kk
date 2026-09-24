from sqlalchemy import select

from src.models.fire_device import FireDevice
from src.repositories.base_repository import BaseRepository


class FireDeviceRepository(BaseRepository):
    def find_all(self, building_id: int | None = None):
        stmt = select(FireDevice)
        if building_id is not None:
            stmt = stmt.where(FireDevice.building_id == building_id)
        return list(self.db.scalars(stmt.order_by(FireDevice.id)).all())

    def find_by_id(self, device_id: int):
        return self.db.get(FireDevice, device_id)

    def find_active_by_building(self, building_id: int):
        stmt = select(FireDevice).where(
            FireDevice.building_id == building_id,
            FireDevice.status == "NORMAL",
        )
        return list(self.db.scalars(stmt).all())

    def create(self, values: dict):
        row = FireDevice(**values)
        self.db.add(row)
        self.db.flush()
        return row
