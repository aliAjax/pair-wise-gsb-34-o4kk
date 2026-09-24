def create_device_outage_dto(**overrides):
    row = {"id":1,"device_id":1,"reason":"reason 1","expected_recovery_at":"2026-06-20T09:00:00Z","status":"PENDING","applicant":"","applied_at":"2026-06-11T09:00:00Z","confirmer":"","confirmed_at":"","device_status_before":"ACTIVE","device_status_after":"","check_result":"","check_note":"","checker":"","checked_at":"","recoverer":"","recovered_at":"","events":[]}
    row.update(overrides)
    return row

def create_device_outage_event(**overrides):
    row = {"action":"APPLY","handler":"","at":"","from_status":"","to_status":"PENDING","note":""}
    row.update(overrides)
    return row
