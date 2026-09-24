export const DeviceStatus = ["ACTIVE","OUT_OF_SERVICE"] as const;
export type DeviceStatus = (typeof DeviceStatus)[number];
export const DeviceStatusText: Record<DeviceStatus, string> = {
  ACTIVE: "正常",
  OUT_OF_SERVICE: "停用"
};
