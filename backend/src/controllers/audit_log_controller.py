from fastapi import Depends
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.audit_log_service import AuditLogService


def list_audit_log(
    target_type: str | None = None,
    target_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = AuditLogService(db)
    return service.list(target_type, target_id)
