import { useEffect, useMemo } from "react";
import { useDeviceStatusFlow } from "../hooks/useDeviceStatusFlow";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { EmptyState } from "../components/common/EmptyState";

export function DashboardPage() {
  const flow = useDeviceStatusFlow();

  useEffect(() => {
    void flow.loadOrders();
  }, [flow]);

  const stats = useMemo(() => {
    const disabled = flow.devices.filter((device) => device.status === "DISABLED").length;
    const pendingOrders = flow.orders.filter((order) => order.state === "PENDING").length;
    const criticalHazards = flow.hazards.filter(
      (hazard) => hazard.rectify_status !== "CLOSED" && (hazard.severity === "CRITICAL" || hazard.severity === "HIGH")
    ).length;
    const returnedTasks = flow.tasks.filter((task) => task.status === "RETURNED").length;
    return { disabled, pendingOrders, criticalHazards, returnedTasks };
  }, [flow.devices, flow.orders, flow.hazards, flow.tasks]);

  return (
    <section className="page-content">
      <header className="content-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>消防合规总览</h1>
        </div>
      </header>

      <section className="metrics">
        <StatCard label="在运/停用设备" value={`${flow.devices.length - stats.disabled} / ${stats.disabled}`} />
        <StatCard label="待主管确认停用单" value={stats.pendingOrders} />
        <StatCard label="退回排期任务" value={stats.returnedTasks} />
        <StatCard label="未关闭高危隐患" value={stats.criticalHazards} />
      </section>

      <div className="two-col">
        <div className="panel">
          <h2>停用 / 复启在途单据</h2>
          {flow.orders.filter((order) => order.state !== "REACTIVATED" && order.state !== "REJECTED").length === 0 && (
            <EmptyState title="当前没有在途的停用/复启单" />
          )}
          <div className="table">
            {flow.orders
              .filter((order) => order.state !== "REACTIVATED" && order.state !== "REJECTED")
              .map((order) => (
                <article key={order.id} className="row">
                  <strong>#{order.id} {order.device_code ?? `设备${order.device_id}`}</strong>
                  <span className="muted">{order.reason}</span>
                  <StatusBadge value={order.state} />
                </article>
              ))}
          </div>
        </div>
        <div className="panel">
          <h2>未关闭高危隐患</h2>
          {flow.hazards.filter((hazard) => hazard.rectify_status !== "CLOSED").length === 0 && (
            <EmptyState title="隐患均已关闭" />
          )}
          <div className="table">
            {flow.hazards
              .filter((hazard) => hazard.rectify_status !== "CLOSED")
              .map((hazard) => (
                <article key={hazard.id} className="row">
                  <strong>隐患#{hazard.id} · 设备{hazard.device_id}</strong>
                  <HazardSeverityTag value={hazard.severity} />
                  <span className="muted">期限 {hazard.deadline}</span>
                </article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
