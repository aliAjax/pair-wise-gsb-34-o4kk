import { useHazardFlow } from "../hooks/useHazardFlow";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { useEffect } from "react";

const RECTIFY_TEXT: Record<string, string> = {
  PENDING: "待派单",
  RECTIFYING: "整改中",
  RECTIFIED: "待复验",
  CLOSED: "已关闭"
};

export function HazardsPage() {
  const { rows: hazards, load } = useHazardTicketStore();
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { pageRows, page, setPage, total } = useHazardFlow(hazards);

  useEffect(() => {
    void load();
    void loadDevices();
  }, [load, loadDevices]);

  const deviceMap = new Map(devices.map((device) => [device.id, device]));
  const pageCount = Math.max(1, Math.ceil(total / 8));

  return (
    <section className="page-content">
      <header className="content-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>隐患整改</h1>
          <p className="muted">设备关联隐患全部关闭后，复启办理才允许“恢复在运”。</p>
        </div>
      </header>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>设备</th>
              <th>分级</th>
              <th>整改期限</th>
              <th>状态</th>
              <th>整改备注</th>
              <th>关闭时间</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((hazard) => {
              const device = deviceMap.get(hazard.device_id);
              return (
                <tr key={hazard.id} className={hazard.rectify_status === "CLOSED" ? "row-muted" : ""}>
                  <td>{hazard.id}</td>
                  <td>{device ? `${device.device_code} · ${device.location_desc}` : `设备#${hazard.device_id}`}</td>
                  <td><HazardSeverityTag value={hazard.severity} /></td>
                  <td>{hazard.deadline}</td>
                  <td>
                    <StatusBadge value={hazard.rectify_status === "PENDING" ? "PENDING" : hazard.rectify_status} />
                    <span className="muted">（{RECTIFY_TEXT[hazard.rectify_status] ?? hazard.rectify_status}）</span>
                  </td>
                  <td>{hazard.rectify_note || "-"}</td>
                  <td>{hazard.closed_at ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {hazards.length === 0 && <EmptyState title="暂无隐患单" />}
        <div className="pager">
          <button className="chip" disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</button>
          <span className="muted">{`第 ${page} / ${pageCount} 页（共 ${total} 条）`}</span>
          <button className="chip" disabled={page * 8 >= total} onClick={() => setPage(page + 1)}>下一页</button>
        </div>
      </div>
    </section>
  );
}
