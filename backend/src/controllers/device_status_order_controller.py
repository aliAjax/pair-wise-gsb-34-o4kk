from fastapi import Depends, Request
from sqlalchemy.orm import Session

from src.models.database import get_db
from src.services.device_status_order_service import DeviceStatusOrderService
from src.types.disable_apply_payload import DisableApplyPayload
from src.types.reactivation_check_payload import ReactivationCheckPayload
from src.types.reject_order_payload import RejectOrderPayload


def list_device_status_order(device_id: int | None = None, db: Session = Depends(get_db)):
    service = DeviceStatusOrderService(db)
    return service.list(device_id)


def detail_device_status_order(order_id: int, db: Session = Depends(get_db)):
    service = DeviceStatusOrderService(db)
    return service.detail(order_id)


def apply_disable(payload: DisableApplyPayload, request: Request, db: Session = Depends(get_db)):
    service = DeviceStatusOrderService(db)
    return service.apply(payload, request.state.user)


def confirm_disable(order_id: int, request: Request, db: Session = Depends(get_db)):
    service = DeviceStatusOrderService(db)
    return service.confirm(order_id, request.state.user)


def reject_disable(
    order_id: int, payload: RejectOrderPayload, request: Request, db: Session = Depends(get_db)
):
    service = DeviceStatusOrderService(db)
    return service.reject(order_id, payload, request.state.user)


def submit_reactivation_check(
    order_id: int, payload: ReactivationCheckPayload, request: Request, db: Session = Depends(get_db)
):
    service = DeviceStatusOrderService(db)
    return service.submit_check(order_id, payload, request.state.user)


def reactivate_device(order_id: int, request: Request, db: Session = Depends(get_db)):
    service = DeviceStatusOrderService(db)
    return service.reactivate(order_id, request.state.user)
