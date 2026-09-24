from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class Building(Base):
    __tablename__ = "building"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128))
    campus: Mapped[str] = mapped_column(String(128))
    floor_count: Mapped[int] = mapped_column(Integer, default=0)
    fire_grade: Mapped[str] = mapped_column(String(32))
    manager_id: Mapped[int] = mapped_column(Integer)
    address_code: Mapped[str] = mapped_column(String(64))
