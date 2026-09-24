from fastapi import Request, HTTPException, Body
from src.services.device_outage_service import DeviceOutageService, OutageError
from src.middlewares.error_handler_middleware import to_error_payload

service = DeviceOutageService()

def _wrap(call):
    try:
        return call()
    except OutageError as exc:
        raise HTTPException(status_code=400, detail=to_error_payload(exc))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail={"code": "INTERNAL_ERROR", "message": str(exc)})

def list_device_outage():
    return _wrap(service.list)

def apply_device_outage(request: Request, payload: dict = Body(...)):
    return _wrap(lambda: service.apply(payload, request.state.user))

def confirm_device_outage(outage_id: int, request: Request):
    return _wrap(lambda: service.confirm(outage_id, request.state.user))

def check_device_outage(outage_id: int, request: Request, payload: dict = Body(...)):
    return _wrap(lambda: service.check(outage_id, payload, request.state.user))

def recover_device_outage(outage_id: int, request: Request):
    return _wrap(lambda: service.recover(outage_id, request.state.user))

def cancel_device_outage(outage_id: int, request: Request):
    return _wrap(lambda: service.cancel(outage_id, request.state.user))
