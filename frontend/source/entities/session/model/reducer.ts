import type { UserRole } from "@/source/entities/user";
import type { SessionAction, SessionState } from "./types";

/** До загрузки профиля известна только роль — с сервера, из адреса кабинета или из cookie. */
export function initialSessionState(role: UserRole | null): SessionState {
  return { user: null, role, isLoading: true, error: null };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "load/start":
      return { ...state, isLoading: true, error: null };
    case "load/success":
      return { user: action.user, role: action.user?.role ?? state.role, isLoading: false, error: null };
    case "load/error":
      return { ...state, isLoading: false, error: action.error };
    case "user/set":
      return { ...state, user: action.user, role: action.user?.role ?? null };
  }
}
