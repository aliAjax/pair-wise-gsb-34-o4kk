from fastapi import Depends, Request
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.fire_device_service import FireDeviceService
from src.types.fire_device_payload import FireDevicePayload


def list_fire_device(building_id: int | None = None, db: Session = Depends(get_db)):
    service = FireDeviceService(db)
    return service.list(building_id)


def create_fire_device(payload: FireDevicePayload, request: Request, db: Session = Depends(get_db)):
    service = FireDeviceService(db)
    return service.create(payload)
