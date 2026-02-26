import { useReducer } from "react";
import type { RegistrationState } from "./types";

export function useRegistrationState(): RegistrationState & {
  setStep: (step: 1 | 2) => void;
  setSelectedRole: (roleId: number | null) => void;
  setOpenedCardId: (cardId: number | null) => void;
  setLogin: (login: string) => void;
  setPassword: (password: string) => void;
  setRepeatPassword: (repeatPassword: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
} {
  const initialState: RegistrationState = {
    step: 1,
    selectedRole: null,
    openedCardId: null,
    login: "",
    password: "",
    repeatPassword: "",
    firstName: "",
    lastName: "",
    isLoading: false,
    error: null,
  };

  type Action =
    | { type: "SET_STEP"; payload: 1 | 2 }
    | { type: "SET_SELECTED_ROLE"; payload: number | null }
    | { type: "SET_OPENED_CARD_ID"; payload: number | null }
    | { type: "SET_LOGIN"; payload: string }
    | { type: "SET_PASSWORD"; payload: string }
    | { type: "SET_REPEAT_PASSWORD"; payload: string }
    | { type: "SET_FIRST_NAME"; payload: string }
    | { type: "SET_LAST_NAME"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "RESET" };

  const reducer = (state: RegistrationState, action: Action): RegistrationState => {
    switch (action.type) {
      case "SET_STEP":
        return { ...state, step: action.payload };
      case "SET_SELECTED_ROLE":
        return { ...state, selectedRole: action.payload };
      case "SET_OPENED_CARD_ID":
        return { ...state, openedCardId: action.payload };
      case "SET_LOGIN":
        return { ...state, login: action.payload };
      case "SET_PASSWORD":
        return { ...state, password: action.payload };
      case "SET_REPEAT_PASSWORD":
        return { ...state, repeatPassword: action.payload };
      case "SET_FIRST_NAME":
        return { ...state, firstName: action.payload };
      case "SET_LAST_NAME":
        return { ...state, lastName: action.payload };
      case "SET_LOADING":
        return { ...state, isLoading: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    ...state,
    setStep: (step) => dispatch({ type: "SET_STEP", payload: step }),
    setSelectedRole: (roleId) => dispatch({ type: "SET_SELECTED_ROLE", payload: roleId }),
    setOpenedCardId: (cardId) => dispatch({ type: "SET_OPENED_CARD_ID", payload: cardId }),
    setLogin: (login) => dispatch({ type: "SET_LOGIN", payload: login }),
    setPassword: (password) => dispatch({ type: "SET_PASSWORD", payload: password }),
    setRepeatPassword: (repeatPassword) => dispatch({ type: "SET_REPEAT_PASSWORD", payload: repeatPassword }),
    setFirstName: (firstName) => dispatch({ type: "SET_FIRST_NAME", payload: firstName }),
    setLastName: (lastName) => dispatch({ type: "SET_LAST_NAME", payload: lastName }),
    setIsLoading: (loading) => dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
