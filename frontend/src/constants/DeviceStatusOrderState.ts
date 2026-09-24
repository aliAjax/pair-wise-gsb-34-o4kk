export const DeviceStatusOrderState = [
  "PENDING",
  "REJECTED",
  "DISABLED",
  "REACTIVATING",
  "REACTIVATED"
] as const;
export type DeviceStatusOrderState = (typeof DeviceStatusOrderState)[number];
export const DeviceStatusOrderStateText: Record<DeviceStatusOrderState, string> = {
  PENDING: "待确认停用",
  REJECTED: "停用驳回",
  DISABLED: "已停用",
  REACTIVATING: "复启检查中",
  REACTIVATED: "已复启"
};
