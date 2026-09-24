import { useEffect, useMemo } from "react";
import { useDeviceStatusFlow } from "../hooks/useDeviceStatusFlow";
import { StatCard } from "../components/common/StatCard";
import { ChartPanel } from "../components/common/ChartPanel";

export function ReportsPage() {
  const flow = useDeviceStatusFlow();

  useEffect(() => {
    void flow.loadOrders();
  }, [flow]);

  const figures = useMemo(() => {
    const closedHazards = flow.hazards.filter((hazard) => hazard.rectify_status === "CLOSED").length;
    const finishedTasks = flow.tasks.filter((task) =>
      ["REVIEWED", "SUBMITTED"].includes(task.status)
    ).length;
    return {
      taskTotal: flow.tasks.length,
      finishedTasks,
      hazardTotal: flow.hazards.length,
      closedHazards,
      disabled: flow.devices.filter((device) => device.status === "DISABLED").length
    };
  }, [flow]);

  const taskBars = [
    { label: "待执行", value: flow.tasks.filter((task) => task.status === "PLANNED").length },
    { label: "执行中", value: flow.tasks.filter((task) => task.status === "IN_PROGRESS").length },
    { label: "退回排期", value: flow.tasks.filter((task) => task.status === "RETURNED").length }
  ];
  const hazardBars = [
    { label: "未关闭", value: figures.hazardTotal - figures.closedHazards },
    { label: "已关闭", value: figures.closedHazards }
  ];

  return (
    <section className="page-content">
      <header className="content-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>合规报表</h1>
        </div>
      </header>
      <section className="metrics">
        <StatCard label="巡检任务总数" value={figures.taskTotal} />
        <StatCard label="停用设备数" value={figures.disabled} />
        <StatCard label="隐患关闭率" value={`${figures.hazardTotal ? Math.round((figures.closedHazards / figures.hazardTotal) * 100) : 0}%`} />
      </section>
      <div className="two-col">
        <ChartPanel title="巡检任务状态分布（本月）" bars={taskBars} />
        <ChartPanel title="隐患整改分布" bars={hazardBars} />
      </div>
    </section>
  );
}
