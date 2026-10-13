import type { ForgotPasswordAction, ForgotPasswordState } from "./types";

export const INITIAL_STATE: ForgotPasswordState = {
  step: "email",
  email: "",
  code: "",
  password: "",
  repeatPassword: "",
  isSubmitting: false,
};

export function forgotPasswordReducer(state: ForgotPasswordState, action: ForgotPasswordAction): ForgotPasswordState {
  switch (action.type) {
    case "email/change":
      return { ...state, email: action.email };
    case "code/change":
      return { ...state, code: action.code };
    case "password/change":
      return { ...state, password: action.password };
    case "repeatPassword/change":
      return { ...state, repeatPassword: action.repeatPassword };
    case "submit/start":
      return { ...state, isSubmitting: true };
    case "submit/success":
      return { ...state, step: action.step, isSubmitting: false };
    case "submit/error":
      return { ...state, isSubmitting: false };
  }
}
