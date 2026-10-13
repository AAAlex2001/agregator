import type { AvailableRole } from "@/source/entities/session";
import type { UserRole } from "@/source/entities/user";

export interface SwitchRoleState {
  roles: AvailableRole[];
  target: UserRole | null;
  password: string;
  error: string | null;
  isSubmitting: boolean;
}

export type SwitchRoleAction =
  | { type: "roles/loaded"; roles: AvailableRole[] }
  | { type: "target/pick"; role: UserRole }
  | { type: "target/cancel" }
  | { type: "password/change"; password: string }
  | { type: "submit/start" }
  | { type: "submit/error"; error: string };
