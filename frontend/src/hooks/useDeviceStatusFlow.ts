import { useEffect, useMemo } from "react";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useDeviceStatusOrderStore } from "../stores/DeviceStatusOrderStore";
import { useRoleStore } from "../stores/RoleStore";
import type { DeviceStatusOrder } from "../types/DeviceStatusOrder";

/**
 * 停用/复启办理 hook：设备页与任务页共用同一套数据与动作。
 * 申请 -> 主管确认停用（联动任务）-> 复启补检 -> 隐患处理完 -> 主管复启。
 */
export function useDeviceStatusFlow() {
  const role = useRoleStore((state) => state.role);
  const { rows: devices, load: loadDevices } = useFireDeviceStore();
  const { rows: tasks, load: loadTasks, reschedule } = useInspectionTaskStore();
  const { rows: hazards, load: loadHazards } = useHazardTicketStore();
  const orderStore = useDeviceStatusOrderStore();

  useEffect(() => {
    void loadDevices();
    void loadTasks();
    void loadHazards();
  }, [loadDevices, loadTasks, loadHazards]);

  const activeOrders = useMemo(() => {
    const map = new Map<number, DeviceStatusOrder>();
    for (const order of orderStore.rows) {
      if (order.state === "REJECTED" || order.state === "REACTIVATED") continue;
      if (!map.has(order.device_id)) map.set(order.device_id, order);
    }
    return map;
  }, [orderStore.rows]);

  const unfinishedHazardCount = (deviceId: number) =>
    hazards.filter((hazard) => hazard.device_id === deviceId && hazard.rectify_status !== "CLOSED").length;

  const refreshAll = () =>
    Promise.all([loadDevices(), loadTasks(), loadHazards(), orderStore.load()]);

  return {
    role,
    devices,
    tasks,
    hazards,
    orders: orderStore.rows,
    activeOrders,
    lastError: orderStore.lastError,
    clearError: orderStore.clearError,
    unfinishedHazardCount,
    loadOrders: orderStore.load,
    applyDisable: orderStore.apply,
    confirmDisable: orderStore.confirm,
    rejectDisable: orderStore.reject,
    submitCheck: orderStore.check,
    reactivate: orderStore.reactivate,
    reschedule,
    refreshAll
  };
}
