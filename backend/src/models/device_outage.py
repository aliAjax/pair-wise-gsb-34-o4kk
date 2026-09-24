from pydantic import BaseModel

class DeviceOutageEvent(BaseModel):
    action: str
    handler: str
    at: str
    from_status: str
    to_status: str
    note: str

class DeviceOutage(BaseModel):
    id: int | float
    device_id: int | float
    reason: str
    expected_recovery_at: str
    status: str
    applicant: str
    applied_at: str
    confirmer: str
    confirmed_at: str
    device_status_before: str
    device_status_after: str
    check_result: str
    check_note: str
    checker: str
    checked_at: str
    recoverer: str
    recovered_at: str
    events: list[DeviceOutageEvent]
