import type { UserProfile, UserRole } from "@/entities/user";

export interface LoginOptions {
  onSuccess: (user: UserProfile) => void;
  onUnverified: (email: string, role: UserRole | null) => void;
  onBusyChange?: (isBusy: boolean) => void;
}

export interface LoginState {
  email: string;
  password: string;
  availableRoles: UserRole[];
  isSubmitting: boolean;
}

export type LoginAction =
  | { type: "email/changed"; email: string }
  | { type: "password/changed"; password: string }
  | { type: "request/started" }
  | { type: "request/finished" }
  | { type: "role/required"; roles: UserRole[] }
  | { type: "role/cancelled" };
