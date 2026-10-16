import type { UserProfile, UserRole } from "@/entities/user";

/** Действия экрана после переключения и во время отправки формы. */
export interface SwitchRoleFormOptions {
  onSwitched: (user: UserProfile) => void;
  onBusyChange?: (isBusy: boolean) => void;
}

/** Поля и состояние формы подтверждения выбранной роли. */
export interface SwitchRoleFormState {
  selectedRole: UserRole | null;
  password: string;
  error: string | null;
  isSubmitting: boolean;
}

/** Действия пользователя и результаты отправки формы. */
export type SwitchRoleFormAction =
  | { type: "role/selected"; role: UserRole }
  | { type: "form/closed" }
  | { type: "password/changed"; password: string }
  | { type: "password/cleared" }
  | { type: "request/started" }
  | { type: "request/finished" }
  | { type: "request/failed"; error: string };
