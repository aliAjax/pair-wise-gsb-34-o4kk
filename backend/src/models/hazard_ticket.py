from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class HazardTicket(Base):
    __tablename__ = "hazard_ticket"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    result_id: Mapped[int] = mapped_column(Integer, index=True)
    # 冗余设备维度，便于按设备判定关联隐患是否处理完
    device_id: Mapped[int] = mapped_column(Integer, index=True)
    severity: Mapped[str] = mapped_column(String(16))
    owner_id: Mapped[int] = mapped_column(Integer)
    deadline: Mapped[str] = mapped_column(String(32))
    # PENDING / RECTIFYING / RECTIFIED / CLOSED
    rectify_status: Mapped[str] = mapped_column(String(16), default="PENDING", index=True)
    rectify_note: Mapped[str] = mapped_column(String(255))
    closed_at: Mapped[str] = mapped_column(String(32), nullable=True)
