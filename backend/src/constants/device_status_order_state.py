# 停用/复启单状态流转：
# PENDING 待主管确认 -> REJECTED 已驳回 / DISABLED 已停用
# DISABLED -> REACTIVATING 复启检查中 -> REACTIVATED 已复启
DeviceStatusOrderState = [
    "PENDING",
    "REJECTED",
    "DISABLED",
    "REACTIVATING",
    "REACTIVATED",
]

DeviceStatusOrderStateText = {
    "PENDING": "待确认停用",
    "REJECTED": "停用驳回",
    "DISABLED": "已停用",
    "REACTIVATING": "复启检查中",
    "REACTIVATED": "已复启",
}
