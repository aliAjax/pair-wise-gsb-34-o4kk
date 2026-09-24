import { create } from "zustand";
import {
  applyDeviceDisable,
  confirmDeviceDisable,
  listDeviceStatusOrder,
  reactivateDevice,
  rejectDeviceDisable,
  submitReactivationCheck
} from "../api/DeviceStatusOrder";
import type {
  DeviceStatusOrder,
  DisableApplyForm,
  ReactivationCheckForm
} from "../types/DeviceStatusOrder";

type State = {
  rows: DeviceStatusOrder[];
  loading: boolean;
  /** 最近一次后端拒绝信息（补检异常 / 隐患未处理完等），供页面直接提示 */
  lastError: string | null;
  load: (deviceId?: number) => Promise<void>;
  clearError: () => void;
  run: (fn: () => Promise<DeviceStatusOrder>) => Promise<DeviceStatusOrder | null>;
  apply: (form: DisableApplyForm) => Promise<DeviceStatusOrder | null>;
  confirm: (orderId: number) => Promise<DeviceStatusOrder | null>;
  reject: (orderId: number, reason: string) => Promise<DeviceStatusOrder | null>;
  check: (orderId: number, form: ReactivationCheckForm) => Promise<DeviceStatusOrder | null>;
  reactivate: (orderId: number) => Promise<DeviceStatusOrder | null>;
};

export const useDeviceStatusOrderStore = create<State>((set, get) => {
  const run = async (fn: () => Promise<DeviceStatusOrder>) => {
    set({ lastError: null });
    try {
      const order = await fn();
      await get().load();
      return order;
    } catch (error) {
      set({ lastError: error instanceof Error ? error.message : "操作失败" });
      return null;
    }
  };

  return {
    rows: [],
    loading: false,
    lastError: null,
    async load(deviceId?: number) {
      set({ loading: true });
      set({ rows: await listDeviceStatusOrder(deviceId), loading: false });
    },
    clearError() {
      set({ lastError: null });
    },
    run,
    apply: (form) => run(() => applyDeviceDisable(form)),
    confirm: (orderId) => run(() => confirmDeviceDisable(orderId)),
    reject: (orderId, reason) => run(() => rejectDeviceDisable(orderId, reason)),
    check: (orderId, form) => run(() => submitReactivationCheck(orderId, form)),
    reactivate: (orderId) => run(() => reactivateDevice(orderId))
  };
});
