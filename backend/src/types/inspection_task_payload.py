from pydantic import BaseModel, Field


class InspectionTaskCreatePayload(BaseModel):
    building_id: int
    inspector_id: int
    plan_date: str
    task_type: str
    checklist_version: str = "v1"
    # 可选指定设备；缺省自动带入该楼栋全部在运设备（停用设备不带入）
    device_ids: list[int] | None = None


class ReschedulePayload(BaseModel):
    plan_date: str = Field(min_length=1)
