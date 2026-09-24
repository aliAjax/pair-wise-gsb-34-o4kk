"""首次启动初始化：建表并灌入本地演示种子（全部本地数据，无第三方服务）。"""
from sqlalchemy import select

from src.models.database import Base, SessionLocal, engine

# 保证 metadata 收录全部 ORM 表
from src.models import building as _building  # noqa: F401
from src.models import fire_device as _fire_device  # noqa: F401
from src.models import inspection_task as _inspection_task  # noqa: F401
from src.models import inspection_result as _inspection_result  # noqa: F401
from src.models import hazard_ticket as _hazard_ticket  # noqa: F401
from src.models import device_status_order as _device_status_order  # noqa: F401
from src.models import audit_log as _audit_log  # noqa: F401

from src.models.building import Building
from src.models.fire_device import FireDevice
from src.models.inspection_task import InspectionTask
from src.models.inspection_result import InspectionResult
from src.models.hazard_ticket import HazardTicket

BUILDINGS = [
    {"id": 1, "name": "1号研发楼", "campus": "梧桐园区", "floor_count": 8,
     "fire_grade": "一级", "manager_id": 31, "address_code": "310000-A01"},
]

DEVICES = [
    {"id": 1, "building_id": 1, "device_code": "FH-0101", "device_type": "HYDRANT",
     "floor": "1F", "location_desc": "大堂东侧消火栓", "install_date": "2024-03-10",
     "status": "NORMAL", "next_maintenance_at": "2026-10-01"},
    {"id": 2, "building_id": 1, "device_code": "SD-0205", "device_type": "SMOKE_DETECTOR",
     "floor": "2F", "location_desc": "205会议室烟感", "install_date": "2024-03-10",
     "status": "NORMAL", "next_maintenance_at": "2026-10-01"},
    {"id": 3, "building_id": 1, "device_code": "SP-0308", "device_type": "SPRINKLER",
     "floor": "3F", "location_desc": "308办公区喷淋头", "install_date": "2024-05-20",
     "status": "NORMAL", "next_maintenance_at": "2026-09-30"},
    {"id": 4, "building_id": 1, "device_code": "EX-0B02", "device_type": "EXIT_LIGHT",
     "floor": "B1", "location_desc": "地下车库出口指示灯", "install_date": "2023-12-01",
     "status": "NORMAL", "next_maintenance_at": "2026-10-15"},
]

TASKS = [
    {"id": 1, "building_id": 1, "inspector_id": 11, "plan_date": "2026-09-28",
     "task_type": "WEEKLY", "status": "PLANNED", "checklist_version": "v2026.1",
     "finished_at": None, "device_ids": "1,2,3,4", "return_reason": None},
    {"id": 2, "building_id": 1, "inspector_id": 11, "plan_date": "2026-09-21",
     "task_type": "WEEKLY", "status": "IN_PROGRESS", "checklist_version": "v2026.1",
     "finished_at": None, "device_ids": "2,3", "return_reason": None},
]

RESULTS = [
    {"id": 1, "task_id": 2, "device_id": 3, "item_code": "SP-PRESSURE",
     "result_status": "ABNORMAL", "measured_value": "0.18MPa", "photo_url": "",
     "note": "喷淋压力偏低，疑似管网渗漏"},
]

HAZARDS = [
    {"id": 1, "result_id": 1, "device_id": 3, "severity": "HIGH", "owner_id": 21,
     "deadline": "2026-09-30", "rectify_status": "RECTIFYING",
     "rectify_note": "已报维保商，待更换密封件", "closed_at": None},
    {"id": 2, "result_id": 1, "device_id": 1, "severity": "LOW", "owner_id": 21,
     "deadline": "2026-08-30", "rectify_status": "CLOSED",
     "rectify_note": "消火栓箱门铰链已上油", "closed_at": "2026-08-26 10:00:00"},
]


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(Building).limit(1)) is not None:
            return
        db.add_all([Building(**row) for row in BUILDINGS])
        db.add_all([FireDevice(**row) for row in DEVICES])
        db.add_all([InspectionTask(**row) for row in TASKS])
        db.add_all([InspectionResult(**row) for row in RESULTS])
        db.add_all([HazardTicket(**row) for row in HAZARDS])
        db.commit()
    finally:
        db.close()
