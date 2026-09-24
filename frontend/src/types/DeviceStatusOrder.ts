/** 设备停用/复启单：报修停用申请到复启恢复的完整留痕 */
export interface DeviceStatusOrder {
  id: number;
  device_id: number;
  device_code?: string | null;
  /** PENDING 待确认停用 / REJECTED 已驳回 / DISABLED 已停用 / REACTIVATING 复启检查中 / REACTIVATED 已复启 */
  state: string;
  reason: string;
  expected_recover_at: string;

  applicant_id: number;
  applicant_name: string;
  applied_at: string;

  confirmer_id: number | null;
  confirmer_name: string | null;
  confirmed_at: string | null;
  reject_reason: string | null;

  checker_id: number | null;
  checker_name: string | null;
  checked_at: string | null;
  check_result: string | null;
  check_note: string | null;

  reactivator_id: number | null;
  reactivator_name: string | null;
  reactivated_at: string | null;

  status_before: string | null;
  status_after: string | null;
}

export interface DisableApplyForm {
  device_id: number;
  reason: string;
  expected_recover_at: string;
}

export interface ReactivationCheckForm {
  result: "NORMAL" | "ABNORMAL";
  note: string;
}
