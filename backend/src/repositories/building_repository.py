from sqlalchemy import select

from src.models.building import Building
from src.repositories.base_repository import BaseRepository


class BuildingRepository(BaseRepository):
    def find_all(self):
        return list(self.db.scalars(select(Building)).all())

    def find_by_id(self, building_id: int):
        return self.db.get(Building, building_id)
