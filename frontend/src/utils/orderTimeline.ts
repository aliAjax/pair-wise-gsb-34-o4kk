import type { DeviceStatusOrder } from "../types/DeviceStatusOrder";
import type { TimelineStep } from "../components/common/TimelineList";

/** 申请到复启的处理人、时间、前后状态时间线 */
export function buildOrderTimeline(order: DeviceStatusOrder): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      key: "apply",
      title: "提交停用申请",
      actor: order.applicant_name,
      time: order.applied_at,
      detail: `原因：${order.reason}；预计恢复：${order.expected_recover_at}`
    }
  ];

  if (order.state === "REJECTED") {
    steps.push({
      key: "reject",
      title: "主管驳回停用",
      actor: order.confirmer_name,
      time: order.confirmed_at,
      detail: order.reject_reason,
      tone: "warn"
    });
    return steps;
  }

  if (order.confirmed_at) {
    steps.push({
      key: "confirm",
      title: "主管确认停用，退回未开始任务",
      actor: order.confirmer_name,
      time: order.confirmed_at,
      detail: `设备状态：${order.status_before ?? "NORMAL"} → ${order.status_after ?? "DISABLED"}`
    });
  }

  if (order.checked_at) {
    const normal = order.check_result === "NORMAL";
    steps.push({
      key: "check",
      title: `复启前补检（${normal ? "结果正常" : "结果异常"}）`,
      actor: order.checker_name,
      time: order.checked_at,
      detail: order.check_note || undefined,
      tone: normal ? "ok" : "warn"
    });
  }

  if (order.state === "REACTIVATED") {
    steps.push({
      key: "reactivate",
      title: "恢复在运（隐患已处理完）",
      actor: order.reactivator_name,
      time: order.reactivated_at,
      detail: `设备状态：${order.status_before ?? "DISABLED"} → ${order.status_after ?? "NORMAL"}`,
      tone: "ok"
    });
  }

  return steps;
}
