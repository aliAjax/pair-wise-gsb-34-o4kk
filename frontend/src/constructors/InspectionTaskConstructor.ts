import type { InspectionTask } from "../types/InspectionTask";

export const createDefaultInspectionTask = (overrides: Partial<InspectionTask> = {}): InspectionTask => ({
  id: 0,
  building_id: 1,
  inspector_id: 1,
  plan_date: "",
  task_type: "WEEKLY",
  status: "PLANNED",
  checklist_version: "v2026.1",
  finished_at: null,
  device_ids: [],
  return_reason: null,
  ...overrides
});

export const createInspectionTaskForm = createDefaultInspectionTask;
export const createInspectionTaskResponse = createDefaultInspectionTask;
