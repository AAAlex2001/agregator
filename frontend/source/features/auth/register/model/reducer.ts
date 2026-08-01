export interface RegisterWizardState {
  step: 1 | 2;
  pendingEmail: string;
}

export type RegisterWizardAction = { type: "GO_TO_CONFIRM"; payload: string };

export const initialRegisterWizardState: RegisterWizardState = {
  step: 1,
  pendingEmail: "",
};

export function registerWizardReducer(
  state: RegisterWizardState,
  action: RegisterWizardAction,
): RegisterWizardState {
  switch (action.type) {
    case "GO_TO_CONFIRM":
      return { ...state, step: 2, pendingEmail: action.payload };
    default:
      return state;
  }
}
