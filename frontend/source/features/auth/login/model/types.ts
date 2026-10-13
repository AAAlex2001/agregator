import type { UserRole } from "@/source/entities/user";

export interface LoginState {
  email: string;
  password: string;
  roles: UserRole[] | null;
  fromOrder: boolean;
  isSubmitting: boolean;
}

export type LoginAction =
  | { type: "email/change"; email: string }
  | { type: "password/change"; password: string }
  | { type: "submit/start" }
  | { type: "submit/finish" }
  | { type: "roles/required"; roles: UserRole[] }
  | { type: "roles/cancel" };
