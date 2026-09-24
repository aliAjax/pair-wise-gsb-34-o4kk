import type { FireDevice } from "../types/FireDevice";

export const createDefaultFireDevice = (overrides: Partial<FireDevice> = {}): FireDevice => ({
  id: 0,
  building_id: 1,
  building_name: null,
  device_code: "",
  device_type: "HYDRANT",
  floor: "1F",
  location_desc: "",
  install_date: "",
  status: "NORMAL",
  next_maintenance_at: "",
  ...overrides
});

export const createFireDeviceForm = createDefaultFireDevice;
export const createFireDeviceResponse = createDefaultFireDevice;
