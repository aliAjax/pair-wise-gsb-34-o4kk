from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class InspectionResult(Base):
    __tablename__ = "inspection_result"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    task_id: Mapped[int] = mapped_column(Integer, index=True)
    device_id: Mapped[int] = mapped_column(Integer, index=True)
    item_code: Mapped[str] = mapped_column(String(64))
    result_status: Mapped[str] = mapped_column(String(16))
    measured_value: Mapped[str] = mapped_column(String(64))
    photo_url: Mapped[str] = mapped_column(String(255))
    note: Mapped[str] = mapped_column(String(255))
