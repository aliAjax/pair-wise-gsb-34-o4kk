import { useEffect, useMemo, useState } from "react";
import { useDeviceStatusFlow } from "../hooks/useDeviceStatusFlow";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { StatusBadge } from "../components/common/StatusBadge";
import { EmptyState } from "../components/common/EmptyState";
import { DisableReactivatePanel } from "../components/common/DisableReactivatePanel";
import { DeviceStatusOrderStateText } from "../constants/DeviceStatusOrderState";

export function DevicesPage() {
  const flow = useDeviceStatusFlow();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    void flow.loadOrders();
  }, [flow]);

  const devices = useMemo(
    () => flow.devices.filter((device) => statusFilter === "ALL" || device.status === statusFilter),
    [flow.devices, statusFilter]
  );

  const selected = flow.devices.find((device) => device.id === selectedId) ?? null;
  const activeOrder = selected ? flow.activeOrders.get(selected.id) ?? null : null;

  return (
    <section className="page-content">
      <header className="content-head">
        <div>
          <p className="eyebrow">fire-inspect</p>
          <h1>消防设备台账</h1>
          <p className="muted">报修停用后设备不再排入周巡检；复启需补检正常且关联隐患处理完。</p>
        </div>
        <div className="filter-bar">
          {["ALL", "NORMAL", "DISABLED"].map((value) => (
            <button
              key={value}
              className={"chip " + (statusFilter === value ? "active" : "")}
              onClick={() => setStatusFilter(value)}
            >
              {value === "ALL" ? "全部" : value === "NORMAL" ? "在运" : "停用"}
            </button>
          ))}
        </div>
      </header>

      <div className="two-col">
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>设备</th>
                <th>状态</th>
                <th>在途单据</th>
                <th>未处理隐患</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const order = flow.activeOrders.get(device.id);
                const hazardCount = flow.unfinishedHazardCount(device.id);
                return (
                  <tr
                    key={device.id}
                    className={selectedId === device.id ? "selected" : ""}
                    onClick={() => setSelectedId(device.id)}
                  >
                    <td><DeviceLocationCell device={device} /></td>
                    <td><StatusBadge value={device.status} /></td>
                    <td>
                      {order ? (
                        <span className="muted">{DeviceStatusOrderStateText[order.state as keyof typeof DeviceStatusOrderStateText]}</span>
                      ) : (
                        <span className="muted">-</span>
                      )}
                    </td>
                    <td>{hazardCount > 0 ? <span className="tag-warn">{hazardCount} 条</span> : "无"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {devices.length === 0 && <EmptyState title="没有符合筛选条件的设备" />}
        </div>

        <aside className="side-panel">
          {selected ? (
            <DisableReactivatePanel device={selected} order={activeOrder} flow={flow} />
          ) : (
            <div className="panel">
              <h3>停用 / 复启办理</h3>
              <EmptyState title="选择左侧设备后可直接办理停用或复启" />
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
