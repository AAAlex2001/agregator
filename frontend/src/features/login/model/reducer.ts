import type { LoginAction, LoginState } from "./types";

export const INITIAL_LOGIN_STATE: LoginState = {
  email: "",
  password: "",
  availableRoles: [],
  isSubmitting: false,
};

/** Хранит поля входа и роли, предложенные сервером. */
export function loginReducer(
  state: LoginState,
  action: LoginAction,
): LoginState {
  switch (action.type) {
    case "email/changed":
      return {
        ...state,
        email: action.email,
        availableRoles: [],
      };
    case "password/changed":
      return {
        ...state,
        password: action.password,
        availableRoles: [],
      };
    case "request/started":
      return { ...state, isSubmitting: true };
    case "request/finished":
      return { ...state, isSubmitting: false };
    case "role/required":
      return { ...state, availableRoles: action.roles };
    case "role/cancelled":
      return { ...state, availableRoles: [] };
  }
}
