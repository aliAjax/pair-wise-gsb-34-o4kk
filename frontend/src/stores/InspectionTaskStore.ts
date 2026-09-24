import { create } from "zustand";
import {
  createInspectionTask,
  listInspectionTask,
  rescheduleInspectionTask
} from "../api/InspectionTask";
import type { InspectionTask } from "../types/InspectionTask";

type State = {
  rows: InspectionTask[];
  loading: boolean;
  load: () => Promise<void>;
  create: (payload: {
    building_id: number;
    inspector_id: number;
    plan_date: string;
    task_type: string;
  }) => Promise<InspectionTask>;
  reschedule: (taskId: number, planDate: string) => Promise<void>;
};

export const useInspectionTaskStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listInspectionTask(), loading: false });
  },
  async create(payload) {
    // 不传 device_ids：后端新建任务时只自动带入在运设备，停用设备不带入
    const row = await createInspectionTask({ ...payload, checklist_version: "v2026.1" });
    set({ rows: [row, ...get().rows] });
    return row;
  },
  async reschedule(taskId, planDate) {
    await rescheduleInspectionTask(taskId, planDate);
    await get().load();
  }
}));
