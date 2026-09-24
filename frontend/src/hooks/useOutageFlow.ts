import { useDeviceOutageStore } from "../stores/DeviceOutageStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { RECTIFY_CLOSED } from "../constants/RectifyStatus";
import type { DeviceOutage } from "../types/DeviceOutage";
import type { HazardTicket } from "../types/HazardTicket";

const ACTIVE_OUTAGE = ["PENDING", "DEACTIVATED"];

export function useOutageFlow() {
  const outages = useDeviceOutageStore((state) => state.rows);
  const devices = useFireDeviceStore((state) => state.rows);
  const results = useInspectionResultStore((state) => state.rows);
  const hazards = useHazardTicketStore((state) => state.rows);

  const reloadAll = async () => {
    await Promise.all([
      useFireDeviceStore.getState().load(),
      useDeviceOutageStore.getState().load(),
      useInspectionTaskStore.getState().load(),
      useInspectionResultStore.getState().load(),
      useHazardTicketStore.getState().load()
    ]);
  };

  const run = async (action: () => Promise<unknown>) => {
    await action();
    await reloadAll();
  };

  const outagesOf = (deviceId: number): DeviceOutage[] =>
    outages.filter((row) => row.device_id === deviceId).sort((a, b) => b.id - a.id);

  const activeOutageOf = (deviceId: number): DeviceOutage | undefined =>
    outages.find((row) => row.device_id === deviceId && ACTIVE_OUTAGE.includes(row.status));

  const isDeactivated = (deviceId: number): boolean =>
    devices.find((row) => row.id === deviceId)?.status === "OUT_OF_SERVICE";

  const openHazardsOf = (deviceId: number): HazardTicket[] => {
    const resultIds = results.filter((row) => row.device_id === deviceId).map((row) => row.id);
    return hazards.filter((row) => resultIds.includes(row.result_id) && row.rectify_status !== RECTIFY_CLOSED);
  };

  const recoverBlockers = (outage: DeviceOutage | undefined): string[] => {
    if (!outage || outage.status !== "DEACTIVATED") return [];
    const blockers: string[] = [];
    if (outage.check_result !== "NORMAL") blockers.push("复启前检查未通过（需补一次检查且结果正常）");
    const open = openHazardsOf(outage.device_id).length;
    if (open > 0) blockers.push(`还有 ${open} 条关联隐患未处理完`);
    return blockers;
  };

  return { outages, reloadAll, run, outagesOf, activeOutageOf, isDeactivated, openHazardsOf, recoverBlockers };
}
