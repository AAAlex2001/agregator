import type { LoginAction, LoginState, SessionAction, SessionState } from "./types";

export const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case "field/change":
      return { ...state, [action.field]: action.value };

    case "submit/start":
      return { ...state, pending: true };

    case "submit/error":
      return { ...state, pending: false };

    default:
      return state;
  }
};

export const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case "session/confirmed":
      return { ready: true };

    default:
      return state;
  }
};
