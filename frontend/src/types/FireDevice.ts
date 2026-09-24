export interface FireDevice {
  id: number;
  building_id: number;
  building_name?: string | null;
  device_code: string;
  device_type: string;
  floor: string;
  location_desc: string;
  install_date: string;
  /** NORMAL 在运 / DISABLED 停用 */
  status: string;
  next_maintenance_at: string;
}
