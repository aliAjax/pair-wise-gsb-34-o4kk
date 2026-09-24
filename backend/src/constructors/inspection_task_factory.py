from src.repositories.inspection_task_repository import parse_device_ids


def create_inspection_task_dto(row) -> dict:
    return {
        "id": row.id,
        "building_id": row.building_id,
        "inspector_id": row.inspector_id,
        "plan_date": row.plan_date,
        "task_type": row.task_type,
        "status": row.status,
        "checklist_version": row.checklist_version,
        "finished_at": row.finished_at,
        "device_ids": parse_device_ids(row.device_ids),
        "return_reason": row.return_reason,
    }
