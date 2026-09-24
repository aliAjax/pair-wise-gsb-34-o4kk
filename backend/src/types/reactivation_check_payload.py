from pydantic import BaseModel, Field


class ReactivationCheckPayload(BaseModel):
    """复启前补一次检查的结果录入。"""

    result: str = Field(pattern="^(NORMAL|ABNORMAL)$")
    note: str = ""
