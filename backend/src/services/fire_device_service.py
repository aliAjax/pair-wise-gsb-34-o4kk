from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.repositories.building_repository import BuildingRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.constructors.fire_device_factory import create_fire_device_dto
from src.utils.errors import ServiceError


class FireDeviceService:
    def __init__(self, db):
        self.repo = FireDeviceRepository(db)
        self.building_repo = BuildingRepository(db)

    def list(self, building_id: int | None = None):
        building_names = {row.id: row.name for row in self.building_repo.find_all()}
        return [
            create_fire_device_dto(row, building_names.get(row.building_id))
            for row in self.repo.find_all(building_id)
        ]

    def get(self, device_id: int):
        row = self.repo.find_by_id(device_id)
        if row is None:
            raise ServiceError(
                ERROR_CODES["DEVICE_NOT_FOUND"], ERROR_MESSAGES["DEVICE_NOT_FOUND"], 404
            )
        building = self.building_repo.find_by_id(row.building_id)
        return create_fire_device_dto(row, building.name if building else None)

    def create(self, payload):
        row = self.repo.create({
            "building_id": payload.building_id,
            "device_code": payload.device_code,
            "device_type": payload.device_type,
            "floor": payload.floor,
            "location_desc": payload.location_desc,
            "install_date": payload.install_date,
            "status": "NORMAL",
            "next_maintenance_at": payload.next_maintenance_at,
        })
        return create_fire_device_dto(row)
