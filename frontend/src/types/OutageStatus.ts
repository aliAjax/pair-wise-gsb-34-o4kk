export const OutageStatus = ["PENDING","DEACTIVATED","RECOVERED","CANCELLED"] as const;
export type OutageStatus = (typeof OutageStatus)[number];
export const OutageStatusText: Record<OutageStatus, string> = {
  PENDING: "待确认",
  DEACTIVATED: "已停用",
  RECOVERED: "已复启",
  CANCELLED: "已取消"
};
export const OutageAction = ["APPLY","CONFIRM","CHECK","RECOVER","CANCEL"] as const;
export type OutageAction = (typeof OutageAction)[number];
export const OutageActionText: Record<OutageAction, string> = {
  APPLY: "提交报修",
  CONFIRM: "确认停用",
  CHECK: "复启检查",
  RECOVER: "复启恢复",
  CANCEL: "取消申请"
};
