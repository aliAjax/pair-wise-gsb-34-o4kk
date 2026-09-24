from src.repositories.inspection_result_repository import InspectionResultRepository
from src.constructors.inspection_result_factory import create_inspection_result_dto


class InspectionResultService:
    def __init__(self, db):
        self.repo = InspectionResultRepository(db)

    def list(self, task_id: int | None = None, device_id: int | None = None):
        return [
            create_inspection_result_dto(row)
            for row in self.repo.find_all(task_id, device_id)
        ]
