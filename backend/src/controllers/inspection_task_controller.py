from fastapi import HTTPException, Body
from src.services.inspection_task_service import InspectionTaskService, TaskError
from src.middlewares.error_handler_middleware import to_error_payload

service = InspectionTaskService()

def list_inspection_task():
    return service.list()

def create_inspection_task(payload: dict = Body(...)):
    try:
        return service.create(payload)
    except TaskError as exc:
        raise HTTPException(status_code=400, detail=to_error_payload(exc))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(exc)})
