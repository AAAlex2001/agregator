import type { LoginState, LoginAction } from "./types";

export const initialLoginState: LoginState = {
  login: "",
  password: "",
  role: "CUSTOMER",
  isLoading: false,
  error: null,
};

export function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
