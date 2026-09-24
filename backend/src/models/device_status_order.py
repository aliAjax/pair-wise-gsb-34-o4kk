from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class DeviceStatusOrder(Base):
    """设备停用/复启单：报修停用申请到复启恢复的完整留痕（处理人、时间、前后状态）。"""

    __tablename__ = "device_status_order"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    device_id: Mapped[int] = mapped_column(Integer, index=True)
    # PENDING / REJECTED / DISABLED / REACTIVATING / REACTIVATED
    state: Mapped[str] = mapped_column(String(16), default="PENDING", index=True)
    reason: Mapped[str] = mapped_column(Text)
    expected_recover_at: Mapped[str] = mapped_column(String(32))

    # 申请环节
    applicant_id: Mapped[int] = mapped_column(Integer)
    applicant_name: Mapped[str] = mapped_column(String(32))
    applied_at: Mapped[str] = mapped_column(String(32))

    # 主管确认 / 驳回
    confirmer_id: Mapped[int] = mapped_column(Integer, nullable=True)
    confirmer_name: Mapped[str] = mapped_column(String(32), nullable=True)
    confirmed_at: Mapped[str] = mapped_column(String(32), nullable=True)
    reject_reason: Mapped[str] = mapped_column(Text, nullable=True)

    # 复启补检
    checker_id: Mapped[int] = mapped_column(Integer, nullable=True)
    checker_name: Mapped[str] = mapped_column(String(32), nullable=True)
    checked_at: Mapped[str] = mapped_column(String(32), nullable=True)
    check_result: Mapped[str] = mapped_column(String(16), nullable=True)
    check_note: Mapped[str] = mapped_column(Text, nullable=True)

    # 实际复启
    reactivator_id: Mapped[int] = mapped_column(Integer, nullable=True)
    reactivator_name: Mapped[str] = mapped_column(String(32), nullable=True)
    reactivated_at: Mapped[str] = mapped_column(String(32), nullable=True)

    # 前后状态快照
    status_before: Mapped[str] = mapped_column(String(16), nullable=True)
    status_after: Mapped[str] = mapped_column(String(16), nullable=True)
