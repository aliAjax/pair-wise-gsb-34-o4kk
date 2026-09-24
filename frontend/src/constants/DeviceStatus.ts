export const DeviceStatus = ["NORMAL", "DISABLED"] as const;
export type DeviceStatus = (typeof DeviceStatus)[number];
export const DeviceStatusText: Record<DeviceStatus, string> = {
  NORMAL: "在运",
  DISABLED: "停用"
};
