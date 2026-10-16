import type { SwitchRoleFormAction, SwitchRoleFormState } from "./types";

/** Закрытая форма без введённого пароля и ошибки. */
export const INITIAL_SWITCH_ROLE_STATE: SwitchRoleFormState = {
  selectedRole: null,
  password: "",
  error: null,
  isSubmitting: false,
};

/** Меняет поля формы, не загружая роли и не управляя сессией. */
export function switchRoleReducer(
  state: SwitchRoleFormState,
  action: SwitchRoleFormAction,
): SwitchRoleFormState {
  switch (action.type) {
    case "role/selected":
      return {
        ...INITIAL_SWITCH_ROLE_STATE,
        selectedRole: action.role,
      };
    case "form/closed":
      return INITIAL_SWITCH_ROLE_STATE;
    case "password/changed":
      return {
        ...state,
        password: action.password,
        error: null,
      };
    case "password/cleared":
      return {
        ...state,
        password: "",
      };
    case "request/started":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      };
    case "request/finished":
      return {
        ...state,
        isSubmitting: false,
      };
    case "request/failed":
      return {
        ...state,
        error: action.error,
      };
  }
}
