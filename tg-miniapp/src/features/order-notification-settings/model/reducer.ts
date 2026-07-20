import type {
  OrderNotificationSettingsAction,
  OrderNotificationSettingsState,
} from "./types";

export function createInitialState(value: string[]): OrderNotificationSettingsState {
  const unique = Array.from(new Set(value));
  return { selected: unique, confirmed: unique, saving: false };
}

export function orderNotificationSettingsReducer(
  state: OrderNotificationSettingsState,
  action: OrderNotificationSettingsAction,
): OrderNotificationSettingsState {
  switch (action.type) {
    case "sync":
      return state.saving ? state : createInitialState(action.value);
    case "optimistic":
      return { ...state, selected: action.value, saving: true };
    case "saved":
      return { selected: action.value, confirmed: action.value, saving: false };
    case "rollback":
      return { selected: action.value, confirmed: action.value, saving: false };
  }
}
