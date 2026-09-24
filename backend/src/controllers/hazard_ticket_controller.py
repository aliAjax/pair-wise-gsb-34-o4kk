from fastapi import Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.hazard_ticket_service import HazardTicketService


def list_hazard_ticket(device_id: int | None = None, db: Session = Depends(get_db)):
    service = HazardTicketService(db)
    return service.list(device_id)
