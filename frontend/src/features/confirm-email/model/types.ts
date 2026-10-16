import type { UserProfile, UserRole } from "@/entities/user";

/** Адрес подтверждения и события завершения формы для внешней композиции. */
export interface ConfirmEmailOptions {
  email: string;
  role: UserRole | null;
  onConfirmed: (user: UserProfile) => void;
  onBusyChange?: (isBusy: boolean) => void;
}

/** Введённый код и выполнение всего сценария подтверждения с загрузкой профиля. */
export interface ConfirmEmailState {
  code: string;
  isSubmitting: boolean;
}

/** Изменение поля и начало или завершение отправки формы. */
export type ConfirmEmailAction =
  | { type: "code/changed"; code: string }
  | { type: "confirmation/started" }
  | { type: "confirmation/finished" };
