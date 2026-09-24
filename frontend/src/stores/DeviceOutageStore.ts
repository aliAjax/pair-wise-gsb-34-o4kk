import { create } from "zustand";
import { listDeviceOutage, applyDeviceOutage, confirmDeviceOutage, checkDeviceOutage, recoverDeviceOutage, cancelDeviceOutage } from "../api/DeviceOutage";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { DeviceOutage, DeviceOutageApplyPayload, DeviceOutageCheckPayload } from "../types/DeviceOutage";

type State = {
  rows: DeviceOutage[];
  loading: boolean;
  load: () => Promise<void>;
  apply: (payload: DeviceOutageApplyPayload) => Promise<void>;
  confirm: (id: number) => Promise<void>;
  check: (id: number, payload: DeviceOutageCheckPayload) => Promise<void>;
  recover: (id: number) => Promise<void>;
  cancel: (id: number) => Promise<void>;
};

export const useDeviceOutageStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listDeviceOutage(), loading: false });
  },
  async apply(payload) {
    console.info(LOG_TEMPLATES.DeviceOutage[0], payload);
    await applyDeviceOutage(payload);
    await get().load();
  },
  async confirm(id) {
    console.info(LOG_TEMPLATES.DeviceOutage[1], id);
    await confirmDeviceOutage(id);
    await get().load();
  },
  async check(id, payload) {
    console.info(LOG_TEMPLATES.DeviceOutage[2], id, payload);
    await checkDeviceOutage(id, payload);
    await get().load();
  },
  async recover(id) {
    console.info(LOG_TEMPLATES.DeviceOutage[3], id);
    await recoverDeviceOutage(id);
    await get().load();
  },
  async cancel(id) {
    console.info(LOG_TEMPLATES.DeviceOutage[4], id);
    await cancelDeviceOutage(id);
    await get().load();
  }
}));
