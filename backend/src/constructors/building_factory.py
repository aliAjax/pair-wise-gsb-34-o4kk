def create_building_dto(row) -> dict:
    return {
        "id": row.id,
        "name": row.name,
        "campus": row.campus,
        "floor_count": row.floor_count,
        "fire_grade": row.fire_grade,
        "manager_id": row.manager_id,
        "address_code": row.address_code,
    }
