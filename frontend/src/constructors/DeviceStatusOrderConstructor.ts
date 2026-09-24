import type {
  DeviceStatusOrder,
  DisableApplyForm,
  ReactivationCheckForm
} from "../types/DeviceStatusOrder";

/** 停用/复启单响应默认结构 */
export const createDefaultDeviceStatusOrder = (
  overrides: Partial<DeviceStatusOrder> = {}
): DeviceStatusOrder => ({
  id: 0,
  device_id: 0,
  device_code: null,
  state: "PENDING",
  reason: "",
  expected_recover_at: "",
  applicant_id: 0,
  applicant_name: "",
  applied_at: "",
  confirmer_id: null,
  confirmer_name: null,
  confirmed_at: null,
  reject_reason: null,
  checker_id: null,
  checker_name: null,
  checked_at: null,
  check_result: null,
  check_note: null,
  reactivator_id: null,
  reactivator_name: null,
  reactivated_at: null,
  status_before: null,
  status_after: null,
  ...overrides
});

/** 报修停用申请表单：选设备、写明原因、预计恢复日 */
export const createDisableApplyForm = (overrides: Partial<DisableApplyForm> = {}): DisableApplyForm => ({
  device_id: 0,
  reason: "",
  expected_recover_at: "",
  ...overrides
});

/** 复启补检表单：默认先录正常，异常时不能恢复 */
export const createReactivationCheckForm = (
  overrides: Partial<ReactivationCheckForm> = {}
): ReactivationCheckForm => ({
  result: "NORMAL",
  note: "",
  ...overrides
});

export const createDeviceStatusOrderResponse = createDefaultDeviceStatusOrder;
