def create_hazard_ticket_dto(row) -> dict:
    return {
        "id": row.id,
        "result_id": row.result_id,
        "device_id": row.device_id,
        "severity": row.severity,
        "owner_id": row.owner_id,
        "deadline": row.deadline,
        "rectify_status": row.rectify_status,
        "rectify_note": row.rectify_note,
        "closed_at": row.closed_at,
    }
