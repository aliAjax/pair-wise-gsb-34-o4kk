import type { HazardTicket } from "../types/HazardTicket";
import { request } from "./request";

export async function listHazardTicket(deviceId?: number): Promise<HazardTicket[]> {
  const query = deviceId ? `?device_id=${deviceId}` : "";
  return request<HazardTicket[]>(`/hazard-ticket${query}`);
}
