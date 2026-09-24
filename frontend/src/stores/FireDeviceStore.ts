import { create } from "zustand";
import { listFireDevice } from "../api/FireDevice";
import type { FireDevice } from "../types/FireDevice";

type State = {
  rows: FireDevice[];
  loading: boolean;
  load: (buildingId?: number) => Promise<void>;
};

export const useFireDeviceStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load(buildingId?: number) {
    set({ loading: true });
    set({ rows: await listFireDevice(buildingId), loading: false });
  }
}));
