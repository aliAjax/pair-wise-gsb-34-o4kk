import type { DeviceOutage, DeviceOutageApplyPayload, DeviceOutageCheckPayload } from "../types/DeviceOutage";

export const createDefaultDeviceOutage = (overrides: Partial<DeviceOutage> = {}): DeviceOutage => ({
  id: 1 as never,
  device_id: 1 as never,
  reason: "reason 1" as never,
  expected_recovery_at: "2026-06-20T09:00:00Z" as never,
  status: "PENDING" as never,
  applicant: "" as never,
  applied_at: "2026-06-11T09:00:00Z" as never,
  confirmer: "" as never,
  confirmed_at: "" as never,
  device_status_before: "ACTIVE" as never,
  device_status_after: "" as never,
  check_result: "" as never,
  check_note: "" as never,
  checker: "" as never,
  checked_at: "" as never,
  recoverer: "" as never,
  recovered_at: "" as never,
  events: [] as never,
  ...overrides
});

export const createDeviceOutageForm = createDefaultDeviceOutage;
export const createDeviceOutageResponse = createDefaultDeviceOutage;

export const createDeviceOutageApplyForm = (device_id: number): DeviceOutageApplyPayload => ({
  device_id,
  reason: "",
  expected_recovery_at: ""
});

export const createDeviceOutageCheckForm = (): DeviceOutageCheckPayload => ({
  result: "NORMAL",
  note: ""
});
