export interface DeviceOutageEvent {
  action: string;
  handler: string;
  at: string;
  from_status: string;
  to_status: string;
  note: string;
}

export interface DeviceOutage {
  id: number;
  device_id: number;
  reason: string;
  expected_recovery_at: string;
  status: string;
  applicant: string;
  applied_at: string;
  confirmer: string;
  confirmed_at: string;
  device_status_before: string;
  device_status_after: string;
  check_result: string;
  check_note: string;
  checker: string;
  checked_at: string;
  recoverer: string;
  recovered_at: string;
  events: DeviceOutageEvent[];
}

export interface DeviceOutageApplyPayload {
  device_id: number;
  reason: string;
  expected_recovery_at: string;
}

export interface DeviceOutageCheckPayload {
  result: string;
  note: string;
}
