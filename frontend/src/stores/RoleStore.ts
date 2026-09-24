import { create } from "zustand";

export type Role = "INSPECTOR" | "MAINTAINER" | "SUPERVISOR" | "AUDITOR";

export const ROLE_TEXT: Record<Role, string> = {
  INSPECTOR: "巡检员",
  MAINTAINER: "维保商",
  SUPERVISOR: "物业主管",
  AUDITOR: "审计员"
};

type RoleState = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  // 默认主管，方便直接确认停用/复启
  role: "SUPERVISOR",
  setRole: (role) => set({ role })
}));
