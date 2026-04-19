import type { RegisterState, RegisterAction } from "./types";

export const initialRegisterState: RegisterState = {
  step: 1,
  selectedRole: null,
  openedCardId: null,
  login: "",
  inn: "",
  innQuery: "",
  password: "",
  repeatPassword: "",
  firstName: "",
  lastName: "",
  isLoading: false,
  error: null,
};

export function registerReducer(state: RegisterState, action: RegisterAction): RegisterState {
  switch (action.type) {
    case "SELECT_ROLE":
      return { ...state, selectedRole: action.payload, step: 2 };
    case "TOGGLE_CARD":
      return { ...state, openedCardId: state.openedCardId === action.payload ? null : action.payload };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
