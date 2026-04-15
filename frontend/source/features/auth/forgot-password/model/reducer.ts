import type { ForgotPasswordState, ForgotPasswordAction } from "./types";

export const initialForgotPasswordState: ForgotPasswordState = {
  step: 1,
  email: "",
  code: "",
  password: "",
  repeatPassword: "",
  isLoading: false,
  error: null,
};

export function forgotPasswordReducer(
  state: ForgotPasswordState,
  action: ForgotPasswordAction,
): ForgotPasswordState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload, error: null };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
