import type { Role } from "@/shared/services/api";

export interface RoleSwitchState {
  target: Role | null;
  password: string;
  busy: boolean;
}

export type RoleSwitchAction =
  | { type: "open"; target: Role }
  | { type: "close" }
  | { type: "password"; value: string }
  | { type: "busy"; value: boolean };
