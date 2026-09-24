from fastapi.responses import JSONResponse

from src.constants.error_codes import ERROR_CODES
from src.utils.errors import ServiceError


def to_error_payload(exc):
    return {"code": getattr(exc, "code", "INTERNAL_ERROR"), "message": str(exc)}


async def service_error_handler(request, exc: ServiceError):
    # service 与 controller 已分别包装业务异常；此处统一出口
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message},
    )


async def unhandled_error_handler(request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"code": ERROR_CODES.get("AUTH_REQUIRED") and "INTERNAL_ERROR", "message": str(exc)},
    )
