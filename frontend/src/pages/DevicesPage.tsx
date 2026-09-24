import { useEffect, useState } from "react";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { OutageFlowPanel } from "../components/common/OutageFlowPanel";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useBuildingStore } from "../stores/BuildingStore";
import { useOutageFlow } from "../hooks/useOutageFlow";
import { formatDate, formatDeviceStatus } from "../utils/formatters";

export function DevicesPage() {
  const devices = useFireDeviceStore((state) => state.rows);
  const buildings = useBuildingStore((state) => state.rows);
  const flow = useOutageFlow();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    useBuildingStore.getState().load();
    void flow.reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildingName = (id: number) => buildings.find((row) => row.id === id)?.name ?? `#${id}`;
  const deactivatedCount = devices.filter((row) => row.status === "OUT_OF_SERVICE").length;
  const pendingCount = flow.outages.filter((row) => row.status === "PENDING").length;
  const selected = devices.find((row) => row.id === selectedId);

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>消防设备台账</h1>
      </div>
      <StatusBadge value="LOCAL_DATA" />
    </section>
    <section className="metrics">
      <StatCard label="设备总数" value={devices.length} />
      <StatCard label="停用中" value={deactivatedCount} />
      <StatCard label="待确认报修" value={pendingCount} />
    </section>
    <section className="panel wide">
      <h2>设备列表</h2>
      <div className="table">
        {devices.map((device) => <article className="row" key={device.id}>
          <strong>{device.device_code}</strong>
          <DeviceLocationCell title={`${buildingName(device.building_id)} ・ ${device.floor} ・ ${device.location_desc}`} value={device.device_type} />
          <span>下次维保：{formatDate(device.next_maintenance_at)}</span>
          <StatusBadge value={device.status} text={formatDeviceStatus(device.status)} />
          <button className="btn" onClick={() => setSelectedId(device.id === selectedId ? null : device.id)}>
            {device.id === selectedId ? "收起" : "停用/复启办理"}
          </button>
        </article>)}
        {devices.length === 0 && <EmptyState title="暂无设备" />}
      </div>
    </section>
    {selected && <OutageFlowPanel device={selected} />}
  </main>;
}
