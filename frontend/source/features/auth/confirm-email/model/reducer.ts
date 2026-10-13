import type { ConfirmEmailAction, ConfirmEmailState } from "./types";

export const INITIAL_STATE: ConfirmEmailState = { code: "", isSubmitting: false, isResending: false };

export function confirmEmailReducer(state: ConfirmEmailState, action: ConfirmEmailAction): ConfirmEmailState {
  switch (action.type) {
    case "code/change":
      return { ...state, code: action.code };
    case "submit/start":
      return { ...state, isSubmitting: true };
    case "submit/error":
      return { ...state, isSubmitting: false };
    case "resend/start":
      return { ...state, isResending: true };
    case "resend/finish":
      return { ...state, isResending: false };
  }
}
