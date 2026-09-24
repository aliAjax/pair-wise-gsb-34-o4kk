from sqlalchemy import select

from src.models.audit_log import AuditLog
from src.repositories.base_repository import BaseRepository


class AuditLogRepository(BaseRepository):
    def find_all(self, target_type: str | None = None, target_id: int | None = None):
        stmt = select(AuditLog).order_by(AuditLog.id.desc())
        if target_type is not None:
            stmt = stmt.where(AuditLog.target_type == target_type)
        if target_id is not None:
            stmt = stmt.where(AuditLog.target_id == str(target_id))
        return list(self.db.scalars(stmt).all())

    def create(self, values: dict):
        row = AuditLog(**values)
        self.db.add(row)
        self.db.flush()
        return row
