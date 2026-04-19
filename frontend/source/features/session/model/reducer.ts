import type { SessionAction, SessionState } from "./types";

export const initialSessionState: SessionState = {
  user: null,
  role: null,
  isLoading: true,
  error: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "SUCCESS":
      return { user: action.user, role: action.role, isLoading: false, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "SET_USER":
      return { ...state, user: action.user, role: action.role };
    case "SET_ROLE":
      return state.role === action.role ? state : { ...state, role: action.role };
    case "MERGE_USER":
      return state.user
        ? {
            ...state,
            user: { ...state.user, ...action.patch },
            role: action.role === undefined ? state.role : action.role,
          }
        : action.role === undefined
          ? state
          : { ...state, role: action.role };
    default:
      return state;
  }
}
