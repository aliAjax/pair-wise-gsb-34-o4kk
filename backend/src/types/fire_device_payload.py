from pydantic import BaseModel, Field


class FireDevicePayload(BaseModel):
    building_id: int
    device_code: str = Field(min_length=1)
    device_type: str
    floor: str = ""
    location_desc: str = ""
    install_date: str = ""
    next_maintenance_at: str = ""
