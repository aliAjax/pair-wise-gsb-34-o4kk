from pydantic import BaseModel, Field


class DisableApplyPayload(BaseModel):
    """报修停用申请：选设备、写明原因和预计恢复日。"""

    device_id: int
    reason: str = Field(min_length=2)
    expected_recover_at: str = Field(min_length=1)
