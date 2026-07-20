export interface OrderNotificationSettingsState {
  selected: string[];
  confirmed: string[];
  saving: boolean;
}

export type OrderNotificationSettingsAction =
  | { type: "sync"; value: string[] }
  | { type: "optimistic"; value: string[] }
  | { type: "saved"; value: string[] }
  | { type: "rollback"; value: string[] };
