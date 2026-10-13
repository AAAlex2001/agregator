import type { SwitchRoleAction, SwitchRoleState } from "./types";

export const INITIAL_STATE: SwitchRoleState = { roles: [], target: null, password: "", error: null, isSubmitting: false };

export function switchRoleReducer(state: SwitchRoleState, action: SwitchRoleAction): SwitchRoleState {
  switch (action.type) {
    case "roles/loaded":
      return { ...state, roles: action.roles };
    case "target/pick":
      return { ...state, target: action.role, password: "", error: null };
    case "target/cancel":
      return { ...state, target: null, password: "", error: null, isSubmitting: false };
    case "password/change":
      return { ...state, password: action.password, error: null };
    case "submit/start":
      return { ...state, isSubmitting: true, error: null };
    case "submit/error":
      return { ...state, isSubmitting: false, error: action.error };
  }
}
