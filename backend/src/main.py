from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.bootstrap import init_db
from src.middlewares.audit_log_middleware import audit_log_middleware
from src.middlewares.auth_middleware import auth_middleware
from src.middlewares.error_handler_middleware import service_error_handler
from src.routes.audit_log_routes import router as audit_log_router
from src.routes.building_routes import router as building_router
from src.routes.device_status_order_routes import router as device_status_order_router
from src.routes.fire_device_routes import router as fire_device_router
from src.routes.hazard_ticket_routes import router as hazard_ticket_router
from src.routes.inspection_result_routes import router as inspection_result_router
from src.routes.inspection_task_routes import router as inspection_task_router
from src.utils.errors import ServiceError


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="消防设施巡检维保平台", lifespan=lifespan)
app.middleware("http")(auth_middleware)
app.middleware("http")(audit_log_middleware)
app.add_exception_handler(ServiceError, service_error_handler)


@app.get("/health")
def health():
    return {"status": "ok", "service": "fire-inspect"}


app.include_router(building_router)
app.include_router(fire_device_router)
app.include_router(inspection_task_router)
app.include_router(inspection_result_router)
app.include_router(hazard_ticket_router)
app.include_router(device_status_order_router)
app.include_router(audit_log_router)
