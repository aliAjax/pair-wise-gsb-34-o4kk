from fastapi import APIRouter
from src.controllers.device_outage_controller import (
    list_device_outage,
    apply_device_outage,
    confirm_device_outage,
    check_device_outage,
    recover_device_outage,
    cancel_device_outage
)
router = APIRouter(prefix="/api/device-outage", tags=["DeviceOutage"])
router.get("")(list_device_outage)
router.post("")(apply_device_outage)
router.post("/{outage_id}/confirm")(confirm_device_outage)
router.post("/{outage_id}/check")(check_device_outage)
router.post("/{outage_id}/recover")(recover_device_outage)
router.post("/{outage_id}/cancel")(cancel_device_outage)
