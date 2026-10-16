/** Число цифр в коде подтверждения нового адреса. */
export const EMAIL_CHANGE_CODE_LENGTH = 6;

/** Поля и открытый шаг окна смены почты. */
export interface ChangeEmailState {
  step: "closed" | "email" | "code";
  email: string;
  code: string;
  error: string | null;
}

/** Окно смены почты: поля, ожидание ответа и действия двух шагов. */
export interface ChangeEmailForm {
  state: ChangeEmailState;
  isPending: boolean;
  open: () => void;
  close: () => void;
  changeEmail: (email: string) => void;
  changeCode: (code: string) => void;
  sendCode: () => void;
  confirm: () => void;
}

/** Изменения полей и шагов после действий пользователя или ответа сервера. */
export type ChangeEmailAction =
  | { type: "dialog/open" }
  | { type: "dialog/close" }
  | { type: "email/change"; email: string }
  | { type: "code/change"; code: string }
  | { type: "request/start" }
  | { type: "code/sent" }
  | { type: "request/failure"; error: string };
