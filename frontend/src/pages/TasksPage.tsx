import { useEffect, useState } from "react";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { OutageFlowPanel } from "../components/common/OutageFlowPanel";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useBuildingStore } from "../stores/BuildingStore";
import { useOutageFlow } from "../hooks/useOutageFlow";
import { DeviceType, DeviceTypeText } from "../constants/DeviceType";
import { formatDate, formatStatus } from "../utils/formatters";

export function TasksPage() {
  const tasks = useInspectionTaskStore((state) => state.rows);
  const devices = useFireDeviceStore((state) => state.rows);
  const buildings = useBuildingStore((state) => state.rows);
  const flow = useOutageFlow();

  const [buildingId, setBuildingId] = useState<number>(1);
  const [planDate, setPlanDate] = useState("");
  const [taskType, setTaskType] = useState<string>(DeviceType[0]);
  const [checklistVersion, setChecklistVersion] = useState("weekly-v1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    useBuildingStore.getState().load();
    void flow.reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildingName = (id: number) => buildings.find((row) => row.id === id)?.name ?? `#${id}`;
  const plannedCount = tasks.filter((row) => row.status === "PLANNED").length;
  const deactivated = devices.filter((row) => row.status === "OUT_OF_SERVICE");

  const submit = async () => {
    setMessage("");
    setError("");
    setBusy(true);
    try {
      const response = await useInspectionTaskStore.getState().create({
        building_id: buildingId,
        inspector_id: 1,
        plan_date: planDate ? `${planDate}T09:00:00Z` : "",
        task_type: taskType,
        checklist_version: checklistVersion
      });
      const skipped = response.skipped_device_ids.length;
      setMessage(`任务 #${response.task.id} 已创建，纳入 ${response.device_ids.length} 台设备${skipped ? `，已跳过 ${skipped} 台停用设备` : ""}`);
      await flow.reloadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>巡检任务</h1>
      </div>
      <StatusBadge value="LOCAL_DATA" />
    </section>
    <section className="metrics">
      <StatCard label="任务总数" value={tasks.length} />
      <StatCard label="未开始" value={plannedCount} />
      <StatCard label="停用设备" value={deactivated.length} />
    </section>
    <section className="panel wide">
      <h2>新建巡检任务</h2>
      <div className="form inline">
        <label>楼栋
          <select value={buildingId} onChange={(event) => setBuildingId(Number(event.target.value))}>
            {buildings.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
          </select>
        </label>
        <label>计划日期
          <input type="date" value={planDate} onChange={(event) => setPlanDate(event.target.value)} />
        </label>
        <label>任务类型
          <select value={taskType} onChange={(event) => setTaskType(event.target.value)}>
            {DeviceType.map((value) => <option key={value} value={value}>{DeviceTypeText[value]}</option>)}
          </select>
        </label>
        <label>检查表版本
          <input value={checklistVersion} onChange={(event) => setChecklistVersion(event.target.value)} />
        </label>
        <div className="actions">
          <button className="btn primary" disabled={busy || !planDate} onClick={submit}>创建任务</button>
        </div>
      </div>
      <p className="hint">停用设备不会纳入新任务的检查项。</p>
      {message && <p className="ok-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
    </section>
    <section className="panel wide">
      <h2>任务列表</h2>
      <div className="table">
        {tasks.map((task) => <article className="row" key={task.id}>
          <strong>任务 #{task.id}</strong>
          <span>{buildingName(task.building_id)} ・ {formatDate(task.plan_date)}</span>
          <span>{formatStatus(task.task_type)} ・ {task.checklist_version}</span>
          <StatusBadge value={task.status} />
        </article>)}
        {tasks.length === 0 && <EmptyState title="暂无任务" />}
      </div>
    </section>
    <section className="panel wide">
      <h2>停用设备复启办理</h2>
      {deactivated.length === 0 && <EmptyState title="当前没有停用设备" />}
      {deactivated.map((device) => <OutageFlowPanel key={device.id} device={device} />)}
    </section>
  </main>;
}
