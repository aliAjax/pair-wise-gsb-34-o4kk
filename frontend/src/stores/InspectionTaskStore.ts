import { create } from "zustand";
import { listInspectionTask, createInspectionTask } from "../api/InspectionTask";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { InspectionTask, CreateInspectionTaskPayload, CreateInspectionTaskResponse } from "../types/InspectionTask";

type State = {
  rows: InspectionTask[];
  loading: boolean;
  load: () => Promise<void>;
  create: (payload: CreateInspectionTaskPayload) => Promise<CreateInspectionTaskResponse>;
};

export const useInspectionTaskStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listInspectionTask(), loading: false });
  },
  async create(payload) {
    console.info(LOG_TEMPLATES.InspectionTask[0], payload);
    const response = await createInspectionTask(payload);
    await get().load();
    return response;
  }
}));
