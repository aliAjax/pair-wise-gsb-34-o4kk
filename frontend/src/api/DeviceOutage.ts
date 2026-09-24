import { mockData } from "../mocks/seedData";
import type { DeviceOutage, DeviceOutageApplyPayload, DeviceOutageCheckPayload } from "../types/DeviceOutage";

const endpoint = "/api/device-outage";
const headers = { "Content-Type": "application/json", "x-role": "supervisor" };

// Offline fallback keeps a mutable local copy so the UI stays usable without the backend.
let localRows: DeviceOutage[] = (mockData.deviceOutage as unknown as DeviceOutage[]).map((row) => ({
  ...row,
  events: row.events.map((event) => ({ ...event }))
}));

const clone = (rows: DeviceOutage[]) => rows.map((row) => ({ ...row, events: row.events.map((event) => ({ ...event })) }));

const nowIso = () => new Date().toISOString();

async function request(path: string, init?: RequestInit) {
  const res = await fetch(path, init);
  if (!res.ok) {
    let detail: { detail?: { code?: string; message?: string }; message?: string } | null = null;
    try {
      detail = await res.json();
    } catch {
      detail = null;
    }
    const payload = detail?.detail ?? detail;
    throw new Error(payload?.message ?? `请求失败(${res.status})`);
  }
  return await res.json();
}

const isOffline = (error: unknown) => error instanceof TypeError;

function localTransit(id: number, action: string, toStatus: string, note: string) {
  const row = localRows.find((item) => item.id === id);
  if (!row) throw new Error("停用单不存在");
  row.events.push({ action, handler: "offline#supervisor", at: nowIso(), from_status: row.status, to_status: toStatus, note });
  row.status = toStatus;
  return row;
}

export async function listDeviceOutage(): Promise<DeviceOutage[]> {
  try {
    return await request(endpoint);
  } catch {
    // Local mock fallback keeps the UI available during offline review.
    return clone(localRows);
  }
}

export async function applyDeviceOutage(payload: DeviceOutageApplyPayload): Promise<DeviceOutage> {
  try {
    return await request(endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
  } catch (error) {
    if (!isOffline(error)) throw error;
    const row: DeviceOutage = {
      id: Math.max(0, ...localRows.map((item) => item.id)) + 1,
      device_id: payload.device_id,
      reason: payload.reason,
      expected_recovery_at: payload.expected_recovery_at,
      status: "PENDING",
      applicant: "offline#supervisor",
      applied_at: nowIso(),
      confirmer: "",
      confirmed_at: "",
      device_status_before: "ACTIVE",
      device_status_after: "",
      check_result: "",
      check_note: "",
      checker: "",
      checked_at: "",
      recoverer: "",
      recovered_at: "",
      events: [{ action: "APPLY", handler: "offline#supervisor", at: nowIso(), from_status: "", to_status: "PENDING", note: payload.reason }]
    };
    localRows.push(row);
    return { ...row, events: row.events.map((event) => ({ ...event })) };
  }
}

export async function confirmDeviceOutage(id: number): Promise<DeviceOutage> {
  try {
    return await request(`${endpoint}/${id}/confirm`, { method: "POST", headers });
  } catch (error) {
    if (!isOffline(error)) throw error;
    const row = localTransit(id, "CONFIRM", "DEACTIVATED", "设备停用，未开始任务退回排期");
    row.confirmer = "offline#supervisor";
    row.confirmed_at = nowIso();
    return { ...row };
  }
}

export async function checkDeviceOutage(id: number, payload: DeviceOutageCheckPayload): Promise<DeviceOutage> {
  try {
    return await request(`${endpoint}/${id}/check`, { method: "POST", headers, body: JSON.stringify(payload) });
  } catch (error) {
    if (!isOffline(error)) throw error;
    const row = localTransit(id, "CHECK", "DEACTIVATED", `复启检查：${payload.result === "NORMAL" ? "正常" : "异常"}。${payload.note}`);
    row.check_result = payload.result;
    row.check_note = payload.note;
    row.checker = "offline#supervisor";
    row.checked_at = nowIso();
    return { ...row };
  }
}

export async function recoverDeviceOutage(id: number): Promise<DeviceOutage> {
  try {
    return await request(`${endpoint}/${id}/recover`, { method: "POST", headers });
  } catch (error) {
    if (!isOffline(error)) throw error;
    const row = localTransit(id, "RECOVER", "RECOVERED", "检查正常且关联隐患已闭环，设备复启");
    row.device_status_after = row.device_status_before || "ACTIVE";
    row.recoverer = "offline#supervisor";
    row.recovered_at = nowIso();
    return { ...row };
  }
}

export async function cancelDeviceOutage(id: number): Promise<DeviceOutage> {
  try {
    return await request(`${endpoint}/${id}/cancel`, { method: "POST", headers });
  } catch (error) {
    if (!isOffline(error)) throw error;
    const row = localTransit(id, "CANCEL", "CANCELLED", "报修申请已取消");
    return { ...row };
  }
}
