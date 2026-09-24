export const ReactivationCheckResult = ["NORMAL", "ABNORMAL"] as const;
export type ReactivationCheckResult = (typeof ReactivationCheckResult)[number];
export const ReactivationCheckResultText: Record<ReactivationCheckResult, string> = {
  NORMAL: "检查正常",
  ABNORMAL: "检查异常"
};
