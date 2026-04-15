import type { SessionAction, SessionState } from "./types";

export const initialSessionState: SessionState = {
  user: null,
  isLoading: true,
  error: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "SUCCESS":
      return { user: action.user, isLoading: false, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "SET_USER":
      return { ...state, user: action.user };
    case "MERGE_USER":
      return state.user ? { ...state, user: { ...state.user, ...action.patch } } : state;
    default:
      return state;
  }
}
