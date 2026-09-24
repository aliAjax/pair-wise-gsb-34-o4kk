from pydantic import BaseModel, Field


class RejectOrderPayload(BaseModel):
    reject_reason: str = Field(min_length=2)
