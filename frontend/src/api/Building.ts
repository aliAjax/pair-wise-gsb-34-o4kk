import type { Building } from "../types/Building";
import { request } from "./request";

export async function listBuilding(): Promise<Building[]> {
  return request<Building[]>("/building");
}
