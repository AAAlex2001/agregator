import type { AuthFormAction, AuthFormState } from "./types";

export const initialState: AuthFormState = {
  email: "",
  password: "",
  loading: false,
  roles: [],
  rolesOpen: false,
};

export function reducer(state: AuthFormState, action: AuthFormAction): AuthFormState {
  switch (action.type) {
    case "email":
      return { ...state, email: action.value };
    case "password":
      return { ...state, password: action.value };
    case "loading":
      return { ...state, loading: action.value };
    case "rolesRequired":
      return { ...state, roles: action.roles, rolesOpen: true, loading: false };
    case "closeRoles":
      return { ...state, rolesOpen: false };
  }
}
