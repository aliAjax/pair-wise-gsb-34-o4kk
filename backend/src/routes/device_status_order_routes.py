from fastapi import APIRouter
from src.controllers.device_status_order_controller import (
    apply_disable,
    confirm_disable,
    detail_device_status_order,
    list_device_status_order,
    reactivate_device,
    reject_disable,
    submit_reactivation_check,
)

router = APIRouter(prefix="/api/device-status-order", tags=["DeviceStatusOrder"])
router.get("")(list_device_status_order)
router.get("/{order_id}")(detail_device_status_order)
# 第一步：报修停用申请（选设备、原因、预计恢复日）
router.post("/apply")(apply_disable)
# 第二步：主管确认停用 / 驳回
router.post("/{order_id}/confirm")(confirm_disable)
router.post("/{order_id}/reject")(reject_disable)
# 第三步：复启前补检
router.post("/{order_id}/check")(submit_reactivation_check)
# 第四步：结果正常且关联隐患处理完，恢复在运
router.post("/{order_id}/reactivate")(reactivate_device)
