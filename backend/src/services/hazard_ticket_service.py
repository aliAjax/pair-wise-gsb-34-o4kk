from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.constructors.hazard_ticket_factory import create_hazard_ticket_dto


class HazardTicketService:
    def __init__(self, db):
        self.repo = HazardTicketRepository(db)

    def list(self, device_id: int | None = None):
        return [
            create_hazard_ticket_dto(row)
            for row in self.repo.find_all(device_id)
        ]
