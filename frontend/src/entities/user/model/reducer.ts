import type { UserAction, UserRole, UserState } from "./types";

/** Создаёт состояние до первой загрузки профиля. */
export function createUserState(role: UserRole | null): UserState {
  return {
    user: null,
    role,
    isLoading: true,
    error: null,
  };
}

/** Обновляет пользователя и состояние загрузки его профиля. */
export function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "profile/loading":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "profile/loaded":
    case "user/changed":
      return {
        user: action.user,
        role: action.user?.role ?? null,
        isLoading: false,
        error: null,
      };

    case "profile/failed":
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    case "profile/updated":
      if (state.user?.id !== action.user.id) {
        return state;
      }

      return {
        ...state,
        user: action.user,
      };

    case "account/authenticated":
      return {
        user: null,
        role: action.role,
        isLoading: true,
        error: null,
      };
  }
}
