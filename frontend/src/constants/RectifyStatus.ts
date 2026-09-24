export const RectifyStatus = ["OPEN","IN_PROGRESS","RECTIFIED","CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = {
  OPEN: "待整改",
  IN_PROGRESS: "整改中",
  RECTIFIED: "已整改",
  CLOSED: "已关闭"
};
export const RECTIFY_CLOSED: RectifyStatus = "CLOSED";
