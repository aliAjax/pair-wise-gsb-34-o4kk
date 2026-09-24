export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  DEVICE_NOT_FOUND: "设备不存在",
  ORDER_NOT_FOUND: "停用/复启单不存在",
  TASK_NOT_FOUND: "巡检任务不存在",
  ORDER_STATE_INVALID: "停用/复启单当前状态不允许该操作",
  DEVICE_STATE_INVALID: "设备当前状态不允许该操作（可能已有在途停用单）",
  CHECK_ABNORMAL: "复启补检结果仍为异常，不能恢复在运",
  HAZARD_UNFINISHED: "设备关联隐患尚未处理完，不能恢复在运"
} as const;
