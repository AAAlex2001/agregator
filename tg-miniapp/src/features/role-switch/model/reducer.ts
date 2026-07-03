import type { RoleSwitchAction, RoleSwitchState } from "./types";

export const initialState: RoleSwitchState = {
  target: null,
  password: "",
  busy: false,
};

export function reducer(state: RoleSwitchState, action: RoleSwitchAction): RoleSwitchState {
  switch (action.type) {
    case "open":
      return { target: action.target, password: "", busy: false };
    case "close":
      return initialState;
    case "password":
      return { ...state, password: action.value };
    case "busy":
      return { ...state, busy: action.value };
  }
}
