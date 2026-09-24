import type { InspectionResult } from "../types/InspectionResult";
import { request } from "./request";

export async function listInspectionResult(params?: {
  task_id?: number;
  device_id?: number;
}): Promise<InspectionResult[]> {
  const search = new URLSearchParams();
  if (params?.task_id) search.set("task_id", String(params.task_id));
  if (params?.device_id) search.set("device_id", String(params.device_id));
  const query = search.toString() ? `?${search.toString()}` : "";
  return request<InspectionResult[]>(`/inspection-result${query}`);
}
