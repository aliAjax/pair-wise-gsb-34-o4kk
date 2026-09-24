import { DeviceStatusText, type DeviceStatus } from "../constants/DeviceStatus";
import { OutageStatusText, type OutageStatus } from "../constants/OutageStatus";
import { OutageCheckResultText, type OutageCheckResult } from "../constants/OutageCheckResult";
import { RectifyStatusText, type RectifyStatus } from "../constants/RectifyStatus";

export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatDeviceStatus = (value: string) => DeviceStatusText[value as DeviceStatus] ?? value;
export const formatOutageStatus = (value: string) => OutageStatusText[value as OutageStatus] ?? value;
export const formatCheckResult = (value: string) => OutageCheckResultText[value as OutageCheckResult] ?? value;
export const formatRectifyStatus = (value: string) => RectifyStatusText[value as RectifyStatus] ?? value;
