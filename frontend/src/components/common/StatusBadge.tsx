import { STATUS_TEXT } from "../../constants/statusText";

type Dict = Record<string, string>;

const TEXT_DICTS: Dict[] = [
  STATUS_TEXT.DeviceStatusOrderState as Dict,
  STATUS_TEXT.DeviceStatus as Dict,
  STATUS_TEXT.InspectionStatus as Dict,
  STATUS_TEXT.HazardSeverity as Dict,
  STATUS_TEXT.ReactivationCheckResult as Dict,
  STATUS_TEXT.DeviceType as Dict
];

export function statusLabel(value: string): string {
  for (const dict of TEXT_DICTS) {
    if (dict[value]) return dict[value];
  }
  return String(value).replace(/_/g, " ");
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={"badge " + String(value).toLowerCase().replace(/_/g, "-")}>
      {statusLabel(value)}
    </span>
  );
}
