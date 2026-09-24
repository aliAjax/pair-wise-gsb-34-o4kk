from src.repositories.audit_log_repository import AuditLogRepository
from src.constructors.audit_log_factory import create_audit_log_dto
from src.utils.formatters import actor_label, audit_target, now_text


class AuditLogService:
    """操作日志：所有写操作（申请/确认/驳回/补检/复启/退回排期）都在此留痕。"""

    def __init__(self, db):
        self.repo = AuditLogRepository(db)
        self.db = db

    def record(self, user: dict, action: str, target_type: str, target_id, detail: str = ""):
        row = self.repo.create({
            "actor": actor_label(user),
            "action": action,
            "target_type": target_type,
            "target_id": str(target_id),
            "detail": detail,
            "created_at": now_text(),
        })
        return create_audit_log_dto(row)

    def list(self, target_type: str | None = None, target_id: int | None = None):
        return [create_audit_log_dto(row) for row in self.repo.find_all(target_type, target_id)]
