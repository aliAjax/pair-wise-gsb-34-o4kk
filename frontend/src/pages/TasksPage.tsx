import { useEffect, useMemo, useState } from "react";
import { useDeviceStatusFlow } from "../hooks/useDeviceStatusFlow";
import { ChecklistPanel } from "../components/common/ChecklistPanel";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { DisableReactivatePanel } from "../components/common/DisableReactivatePanel";
import { ReschedulePanel } from "../components/common/ReschedulePanel";
import { DeviceStatusOrderStateText } from "../constants/DeviceStatusOrderState";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { useRoleStore } from "../stores/RoleStore";

export function TasksPage() {
  const flow = useDeviceStatusFlow();
  const role = useRoleStore((state) => state.role);
  const createTask = useInspectionTaskStore((state) => state.create);
  const [planDate, setPlanDate] = useState("2026-10-05");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(1);
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void flow.loadOrders();
  }, [flow]);

  const selectedTask = useMemo(
    () => flow.tasks.find((task) => task.id === selectedTaskId) ?? null,
    [flow.tasks, selectedTaskId]
  );
  const panelDevice = flow.devices.find((device) => device.id === deviceId) ?? null;
  const panelOrder = panelDevice ? flow.activeOrders.get(panelDevice.id) ?? null : null;

  const createWeekly = async () => {
    setNotice(null);
    try {
      const row = await createTask({
        building_id: 1,
        inspector_id: 11,
        plan_date: planDate,
        task_type: "WEEKLY"
      });
      setSelectedTaskId(row.id);
      setNotice(`已新建任务，自动纳入在运设备 ${row.device_ids.join(", ") || "（无可用设备）"}`);
      await flow.refreshAll();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "新建失败");
    }
  };

  return (
    <section className="page-content">
      <header className="content-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>巡检任务</h1>
          <p className="muted">新建周巡检只带入在运设备；停用确认时未开始任务剔除停用设备并退回排期。</p>
        </div>
        <div className="create-bar">
          <input type="date" value={planDate} onChange={(event) => setPlanDate(event.target.value)} />
          <button className="btn primary" onClick={() => void createWeekly()} disabled={!["INSPECTOR", "SUPERVISOR"].includes(role)}>
            新建周巡检（自动排除停用设备）
          </button>
        </div>
      </header>
      {notice && <p className="alert info">{notice}</p>}

      <div className="two-col wide-left">
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>计划日期</th>
                <th>状态</th>
                <th>设备数</th>
                <th>退回/办理</th>
              </tr>
            </thead>
            <tbody>
              {flow.tasks.map((task) => (
                <tr
                  key={task.id}
                  className={selectedTaskId === task.id ? "selected" : ""}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <td>{task.id}</td>
                  <td>{task.plan_date}</td>
                  <td><StatusBadge value={task.status} /></td>
                  <td>{task.device_ids.length}</td>
                  <td>
                    {task.status === "RETURNED" ? (
                      <ReschedulePanel task={task} flow={flow} />
                    ) : (
                      <button
                        className="link-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          const firstId = task.device_ids[0];
                          if (firstId) setDeviceId(firstId);
                        }}
                      >
                        办理设备停用
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {flow.tasks.length === 0 && <EmptyState title="暂无巡检任务" />}

          <div className="task-device-actions">
            <label>
              直接选设备办理：
              <select value={deviceId ?? ""} onChange={(event) => setDeviceId(event.target.value ? Number(event.target.value) : null)}>
                <option value="">请选择设备</option>
                {flow.devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.device_code}（{DeviceStatusOrderStateText[flow.activeOrders.get(device.id)?.state as keyof typeof DeviceStatusOrderStateText] ?? (device.status === "NORMAL" ? "在运" : "停用")}）
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <aside className="side-panel">
          <ChecklistPanel task={selectedTask} devices={flow.devices} />
          {panelDevice ? (
            <DisableReactivatePanel device={panelDevice} order={panelOrder} flow={flow} />
          ) : (
            <div className="panel">
              <h3>停用 / 复启办理</h3>
              <EmptyState title="在下方选择设备即可办理停用或复启" />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
