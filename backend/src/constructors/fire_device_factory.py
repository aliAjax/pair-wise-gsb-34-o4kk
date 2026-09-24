def create_fire_device_dto(row, building_name: str | None = None) -> dict:
    return {
        "id": row.id,
        "building_id": row.building_id,
        "building_name": building_name,
        "device_code": row.device_code,
        "device_type": row.device_type,
        "floor": row.floor,
        "location_desc": row.location_desc,
        "install_date": row.install_date,
        "status": row.status,
        "next_maintenance_at": row.next_maintenance_at,
    }
