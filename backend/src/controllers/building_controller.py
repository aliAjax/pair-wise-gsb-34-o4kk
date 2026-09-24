from fastapi import Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.building_service import BuildingService


def list_building(db: Session = Depends(get_db)):
    service = BuildingService(db)
    return service.list()
