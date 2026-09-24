import type { InspectionTask } from "../types/InspectionTask";
import { request } from "./request";

export interface CreateInspectionTaskPayload {
  building_id: number;
  inspector_id: number;
  plan_date: string;
  task_type: string;
  checklist_version?: string;
  device_ids?: number[];
}

export async function listInspectionTask(params?: {
  status?: string;
  building_id?: number;
}): Promise<InspectionTask[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.building_id) search.set("building_id", String(params.building_id));
  const query = search.toString() ? `?${search.toString()}` : "";
  return request<InspectionTask[]>(`/inspection-task${query}`);
}

export async function createInspectionTask(
  payload: CreateInspectionTaskPayload
): Promise<InspectionTask> {
  return request<InspectionTask>("/inspection-task", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/** 退回排期的任务重新排期（复启后可再次纳入设备） */
export async function rescheduleInspectionTask(
  taskId: number,
  planDate: string
): Promise<InspectionTask> {
  return request<InspectionTask>(`/inspection-task/${taskId}/reschedule`, {
    method: "POST",
    body: JSON.stringify({ plan_date: planDate })
  });
}
