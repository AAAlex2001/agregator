import type { ChangeEmailAction, ChangeEmailState } from "./types";

/** Закрытое окно без адреса, кода и ошибки предыдущей попытки. */
export const INITIAL_CHANGE_EMAIL_STATE: ChangeEmailState = {
  step: "closed",
  email: "",
  code: "",
  error: null,
};

/** Сохраняет поля при ошибке и переключает шаг после отправки кода. */
export function changeEmailReducer(
  state: ChangeEmailState,
  action: ChangeEmailAction,
): ChangeEmailState {
  switch (action.type) {
    case "dialog/open":
      return {
        ...INITIAL_CHANGE_EMAIL_STATE,
        step: "email",
      };
    case "dialog/close":
      return INITIAL_CHANGE_EMAIL_STATE;
    case "email/change":
      return {
        ...state,
        email: action.email,
        error: null,
      };
    case "code/change":
      return {
        ...state,
        code: action.code,
        error: null,
      };
    case "request/start":
      return {
        ...state,
        error: null,
      };
    case "code/sent":
      return {
        ...state,
        step: "code",
        code: "",
        error: null,
      };
    case "request/failure":
      return {
        ...state,
        error: action.error,
      };
  }
}
