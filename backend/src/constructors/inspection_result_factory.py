def create_inspection_result_dto(row) -> dict:
    return {
        "id": row.id,
        "task_id": row.task_id,
        "device_id": row.device_id,
        "item_code": row.item_code,
        "result_status": row.result_status,
        "measured_value": row.measured_value,
        "photo_url": row.photo_url,
        "note": row.note,
    }
