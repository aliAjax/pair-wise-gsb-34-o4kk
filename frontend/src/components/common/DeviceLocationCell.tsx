import type { FireDevice } from "../../types/FireDevice";
import { DeviceTypeText } from "../../constants/DeviceType";

export function DeviceLocationCell({ device }: { device: FireDevice }) {
  return (
    <div className="device-cell">
      <strong>{device.device_code}</strong>
      <span>
        {DeviceTypeText[device.device_type as keyof typeof DeviceTypeText] ?? device.device_type}
      </span>
      <span className="muted">
        {device.building_name ? `${device.building_name} · ` : ""}
        {device.floor} · {device.location_desc}
      </span>
    </div>
  );
}
