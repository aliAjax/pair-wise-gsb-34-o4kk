from src.repositories.building_repository import BuildingRepository
from src.constructors.building_factory import create_building_dto


class BuildingService:
    def __init__(self, db):
        self.repo = BuildingRepository(db)

    def list(self):
        return [create_building_dto(row) for row in self.repo.find_all()]
