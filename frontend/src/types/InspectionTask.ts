export interface InspectionTask {
  id: number;
  building_id: number;
  inspector_id: number;
  plan_date: string;
  task_type: string;
  status: string;
  checklist_version: string;
  finished_at: string;
}

export interface CreateInspectionTaskPayload {
  building_id: number;
  inspector_id: number;
  plan_date: string;
  task_type: string;
  checklist_version: string;
}

export interface CreateInspectionTaskResponse {
  task: InspectionTask;
  device_ids: number[];
  skipped_device_ids: number[];
}
