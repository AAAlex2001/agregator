import type {
  ResetPasswordAction,
  ResetPasswordState,
} from "./types";

export const INITIAL_RESET_PASSWORD_STATE: ResetPasswordState = {
  step: "email",
  email: "",
  code: "",
  password: "",
  repeatPassword: "",
  isSubmitting: false,
};

/** Переводит восстановление пароля к следующему шагу только после ответа сервера. */
export function resetPasswordReducer(
  state: ResetPasswordState,
  action: ResetPasswordAction,
): ResetPasswordState {
  switch (action.type) {
    case "email/changed":
      return { ...state, email: action.email };
    case "code/changed":
      return { ...state, code: action.code };
    case "password/changed":
      return { ...state, password: action.password };
    case "password-repeat/changed":
      return { ...state, repeatPassword: action.password };
    case "request/started":
      return { ...state, isSubmitting: true };
    case "request/failed":
      return { ...state, isSubmitting: false };
    case "email/sent":
      return { ...state, step: "code", isSubmitting: false };
    case "code/confirmed":
      return { ...state, step: "password", isSubmitting: false };
    case "password/saved":
      return {
        ...state,
        step: "done",
        password: "",
        repeatPassword: "",
        code: "",
        isSubmitting: false,
      };
  }
}
