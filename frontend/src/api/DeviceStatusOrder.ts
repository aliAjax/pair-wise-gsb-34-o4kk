import type {
  DeviceStatusOrder,
  DisableApplyForm,
  ReactivationCheckForm
} from "../types/DeviceStatusOrder";
import { request } from "./request";

export async function listDeviceStatusOrder(deviceId?: number): Promise<DeviceStatusOrder[]> {
  const query = deviceId ? `?device_id=${deviceId}` : "";
  return request<DeviceStatusOrder[]>(`/device-status-order${query}`);
}

export function getDeviceStatusOrder(orderId: number): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>(`/device-status-order/${orderId}`);
}

/** 报修停用申请：选设备、写明原因和预计恢复日 */
export function applyDeviceDisable(form: DisableApplyForm): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>("/device-status-order/apply", {
    method: "POST",
    body: JSON.stringify(form)
  });
}

/** 主管确认停用：停用设备、新任务不再带入、未开始任务退回排期 */
export function confirmDeviceDisable(orderId: number): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>(`/device-status-order/${orderId}/confirm`, {
    method: "POST"
  });
}

export function rejectDeviceDisable(orderId: number, rejectReason: string): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>(`/device-status-order/${orderId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reject_reason: rejectReason })
  });
}

/** 复启前补一次检查 */
export function submitReactivationCheck(
  orderId: number,
  form: ReactivationCheckForm
): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>(`/device-status-order/${orderId}/check`, {
    method: "POST",
    body: JSON.stringify(form)
  });
}

/** 结果正常且关联隐患处理完，主管恢复在运 */
export function reactivateDevice(orderId: number): Promise<DeviceStatusOrder> {
  return request<DeviceStatusOrder>(`/device-status-order/${orderId}/reactivate`, {
    method: "POST"
  });
}
