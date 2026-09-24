from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.models.database import Base


class InspectionTask(Base):
    __tablename__ = "inspection_task"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    building_id: Mapped[int] = mapped_column(Integer, index=True)
    inspector_id: Mapped[int] = mapped_column(Integer)
    plan_date: Mapped[str] = mapped_column(String(32))
    task_type: Mapped[str] = mapped_column(String(32))
    # PLANNED / IN_PROGRESS / SUBMITTED / REVIEWED / OVERDUE / RETURNED
    status: Mapped[str] = mapped_column(String(16), default="PLANNED", index=True)
    checklist_version: Mapped[str] = mapped_column(String(32))
    finished_at: Mapped[str] = mapped_column(String(32), nullable=True)
    # 逗号分隔的设备清单；停用确认时未开始的任务会剔除停用设备
    device_ids: Mapped[str] = mapped_column(String(255), default="")
    # 退回排期原因，例如被停用联动剔除
    return_reason: Mapped[str] = mapped_column(String(255), nullable=True)
