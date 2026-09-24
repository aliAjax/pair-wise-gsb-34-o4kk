import { create } from "zustand";
import { listAuditLog } from "../api/AuditLog";
import type { AuditLog } from "../types/AuditLog";

type State = {
  rows: AuditLog[];
  load: (params?: { target_type?: string; target_id?: number }) => Promise<void>;
};

export const useAuditLogStore = create<State>((set) => ({
  rows: [],
  async load(params) {
    set({ rows: await listAuditLog(params) });
  }
}));
