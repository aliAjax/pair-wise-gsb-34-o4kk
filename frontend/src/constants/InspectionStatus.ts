export const InspectionStatus = [
  "PLANNED",
  "IN_PROGRESS",
  "SUBMITTED",
  "REVIEWED",
  "OVERDUE",
  "RETURNED"
] as const;
export type InspectionStatus = (typeof InspectionStatus)[number];
export const InspectionStatusText: Record<InspectionStatus, string> = {
  PLANNED: "待执行",
  IN_PROGRESS: "执行中",
  SUBMITTED: "已提交",
  REVIEWED: "已复核",
  OVERDUE: "已逾期",
  RETURNED: "退回排期"
};
