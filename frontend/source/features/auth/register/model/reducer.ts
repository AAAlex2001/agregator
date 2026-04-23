export interface RegisterWizardState {
  step: 1 | 2 | 3;
  selectedRole: number | null;
  openedCardId: number | null;
  pendingEmail: string;
}

export type RegisterWizardAction =
  | { type: "SELECT_ROLE"; payload: number }
  | { type: "TOGGLE_CARD"; payload: number }
  | { type: "BACK_TO_ROLES" }
  | { type: "GO_TO_CONFIRM"; payload: string };

export const initialRegisterWizardState: RegisterWizardState = {
  step: 1,
  selectedRole: null,
  openedCardId: null,
  pendingEmail: "",
};

export function registerWizardReducer(
  state: RegisterWizardState,
  action: RegisterWizardAction,
): RegisterWizardState {
  switch (action.type) {
    case "SELECT_ROLE":
      return { ...state, selectedRole: action.payload, step: 2 };
    case "TOGGLE_CARD":
      return {
        ...state,
        openedCardId: state.openedCardId === action.payload ? null : action.payload,
      };
    case "BACK_TO_ROLES":
      return { ...state, step: 1 };
    case "GO_TO_CONFIRM":
      return { ...state, step: 3, pendingEmail: action.payload };
    default:
      return state;
  }
}
