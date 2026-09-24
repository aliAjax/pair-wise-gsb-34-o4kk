import { mockData } from "../mocks/seedData";
import type { InspectionTask, CreateInspectionTaskPayload, CreateInspectionTaskResponse } from "../types/InspectionTask";

const endpoint = "/api/inspection-task";
const headers = { "Content-Type": "application/json", "x-role": "supervisor" };

export async function listInspectionTask(): Promise<InspectionTask[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.inspectionTask as unknown as InspectionTask[])];
}

export async function saveInspectionTask(payload: InspectionTask) {
  console.info("save InspectionTask", payload);
  return payload;
}

export async function createInspectionTask(payload: CreateInspectionTaskPayload): Promise<CreateInspectionTaskResponse> {
  try {
    const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
    if (!res.ok) {
      let detail: { detail?: { code?: string; message?: string }; message?: string } | null = null;
      try {
        detail = await res.json();
      } catch {
        detail = null;
      }
      const body = detail?.detail ?? detail;
      throw new Error(body?.message ?? `请求失败(${res.status})`);
    }
    return await res.json();
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    // Offline fallback: build the task locally and skip OUT_OF_SERVICE devices.
    const devices = (mockData.fireDevice as unknown as { id: number; building_id: number; status: string }[]).filter((row) => row.building_id === payload.building_id);
    const active = devices.filter((row) => row.status !== "OUT_OF_SERVICE");
    const skipped = devices.filter((row) => row.status === "OUT_OF_SERVICE");
    const task: InspectionTask = {
      id: Math.max(0, ...(mockData.inspectionTask as unknown as InspectionTask[]).map((row) => row.id)) + 1,
      building_id: payload.building_id,
      inspector_id: payload.inspector_id,
      plan_date: payload.plan_date,
      task_type: payload.task_type,
      status: "PLANNED",
      checklist_version: payload.checklist_version,
      finished_at: ""
    };
    return { task, device_ids: active.map((row) => row.id), skipped_device_ids: skipped.map((row) => row.id) };
  }
}
