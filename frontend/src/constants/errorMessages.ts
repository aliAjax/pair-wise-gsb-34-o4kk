export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  DEVICE_NOT_FOUND: "设备不存在或已被移除",
  DEVICE_BUSY: "该设备已有进行中的停用单",
  OUTAGE_NOT_FOUND: "停用单不存在",
  OUTAGE_STATE_INVALID: "当前状态不允许执行该操作",
  OUTAGE_CHECK_REQUIRED: "复启前需补一次检查且结果正常",
  HAZARD_OPEN: "关联隐患未处理完，暂不能复启"
};
