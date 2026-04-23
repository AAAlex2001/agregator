import type { ProfileFormState, ProfileFormAction } from "./types";

export function createInitialState(profile: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailNotificationsEnabled: boolean;
}): ProfileFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: profile.email,
    password: "",
    repeatPassword: "",
    emailNotificationsEnabled: profile.emailNotificationsEnabled,
    isSaving: false,
    error: null,
    success: null,
  };
}

export function profileFormReducer(
  state: ProfileFormState,
  action: ProfileFormAction,
): ProfileFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, error: null, success: null };
    case "SET_EMAIL_NOTIFICATIONS":
      return { ...state, emailNotificationsEnabled: action.payload, error: null, success: null };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, success: null };
    case "SET_SUCCESS":
      return { ...state, success: action.payload, error: null };
    case "RESET_PASSWORD":
      return { ...state, password: "", repeatPassword: "" };
    default:
      return state;
  }
}
