from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class FireDevice(Base):
    __tablename__ = "fire_device"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    building_id: Mapped[int] = mapped_column(Integer, index=True)
    device_code: Mapped[str] = mapped_column(String(64), unique=True)
    device_type: Mapped[str] = mapped_column(String(32))
    floor: Mapped[str] = mapped_column(String(16))
    location_desc: Mapped[str] = mapped_column(String(255))
    install_date: Mapped[str] = mapped_column(String(32))
    # NORMAL 在运 / DISABLED 停用（报修确认停用后切换，复启补检通过后恢复）
    status: Mapped[str] = mapped_column(String(16), default="NORMAL", index=True)
    next_maintenance_at: Mapped[str] = mapped_column(String(32))
