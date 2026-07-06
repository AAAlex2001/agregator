import type { Role } from "@/shared/services/api";

export interface AuthFormState {
  email: string;
  password: string;
  loading: boolean;
  roles: Role[];
  rolesOpen: boolean;
}

export type AuthFormAction =
  | { type: "email"; value: string }
  | { type: "password"; value: string }
  | { type: "loading"; value: boolean }
  | { type: "rolesRequired"; roles: Role[] }
  | { type: "closeRoles" };
