import type { AuditLog } from "../types/AuditLog";
import { request } from "./request";

export async function listAuditLog(params?: {
  target_type?: string;
  target_id?: number;
}): Promise<AuditLog[]> {
  const search = new URLSearchParams();
  if (params?.target_type) search.set("target_type", params.target_type);
  if (params?.target_id) search.set("target_id", String(params.target_id));
  const query = search.toString() ? `?${search.toString()}` : "";
  return request<AuditLog[]>(`/audit-log${query}`);
}
