import type { FireDevice } from "../types/FireDevice";
import { request } from "./request";

export async function listFireDevice(buildingId?: number): Promise<FireDevice[]> {
  const query = buildingId ? `?building_id=${buildingId}` : "";
  return request<FireDevice[]>(`/fire-device${query}`);
}
