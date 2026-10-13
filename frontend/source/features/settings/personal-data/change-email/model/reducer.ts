import type { ChangeEmailAction, ChangeEmailState } from "./types";

export const CLOSED: ChangeEmailState = { step: "closed", email: "", code: "", error: null, isPending: false };

export function changeEmailReducer(state: ChangeEmailState, action: ChangeEmailAction): ChangeEmailState {
  switch (action.type) {
    case "modal/open":
      return { ...CLOSED, step: "email" };
    case "modal/close":
      return CLOSED;
    case "email/change":
      return { ...state, email: action.email, error: null };
    case "code/change":
      return { ...state, code: action.code, error: null };
    case "request/start":
      return { ...state, isPending: true, error: null };
    case "request/codeSent":
      return { ...state, step: "code", code: "", isPending: false };
    case "request/error":
      return { ...state, isPending: false, error: action.error };
    default:
      return state;
  }
}
