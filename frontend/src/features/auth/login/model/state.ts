import { useReducer } from "react";
import type { LoginState, UserRole } from "./types";

export function useLoginState(): LoginState & {
  setLogin: (login: string) => void;
  setPassword: (password: string) => void;
  setRole: (role: UserRole) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} {
  const initialState: LoginState = {
    login: "",
    password: "",
    role: "CUSTOMER",
    isLoading: false,
    error: null,
  };

  type Action =
    | { type: "SET_LOGIN"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_ROLE"; payload: UserRole }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "RESET" };

  const reducer = (state: LoginState, action: Action): LoginState => {
    switch (action.type) {
      case "SET_LOGIN":    return { ...state, login: action.payload };
      case "SET_PASSWORD": return { ...state, password: action.payload };
      case "SET_ROLE":     return { ...state, role: action.payload };
      case "SET_LOADING":  return { ...state, isLoading: action.payload };
      case "SET_ERROR":    return { ...state, error: action.payload };
      case "RESET":        return initialState;
      default:             return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    ...state,
    setLogin: (login) => dispatch({ type: "SET_LOGIN", payload: login }),
    setPassword: (password) => dispatch({ type: "SET_PASSWORD", payload: password }),
    setRole: (role) => dispatch({ type: "SET_ROLE", payload: role }),
    setIsLoading: (loading) => dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
