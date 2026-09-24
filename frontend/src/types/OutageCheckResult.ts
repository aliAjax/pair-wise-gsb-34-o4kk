export const OutageCheckResult = ["NORMAL","ABNORMAL"] as const;
export type OutageCheckResult = (typeof OutageCheckResult)[number];
export const OutageCheckResultText: Record<OutageCheckResult, string> = {
  NORMAL: "正常",
  ABNORMAL: "异常"
};
