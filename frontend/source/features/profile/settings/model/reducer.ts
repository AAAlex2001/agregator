import type { ProfileFormState, ProfileFormAction } from "./types";

export function createInitialState(profile: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}): ProfileFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: profile.email,
    password: "",
    repeatPassword: "",
    isSaving: false,
  };
}

export function profileFormReducer(
  state: ProfileFormState,
  action: ProfileFormAction,
): ProfileFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "RESET_PASSWORD":
      return { ...state, password: "", repeatPassword: "" };
    default:
      return state;
  }
}
