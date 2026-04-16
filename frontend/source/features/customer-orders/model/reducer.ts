import type { OrderCardData } from "@/source/entities/order";
import type { CustomerOrdersState, Mode } from "./types";

export type Action =
  | { type: "LOADING"; value: boolean }
  | { type: "ERROR"; value: string | null }
  | { type: "DATA"; items: OrderCardData[]; total: number }
  | { type: "MODE"; mode: Mode; editTarget?: OrderCardData | null }
  | { type: "SUBMITTING"; value: boolean }
  | { type: "DELETING"; id: number | null };

export const initial: CustomerOrdersState = {
  items: [], total: 0, isLoading: false, error: null,
  mode: "list", editTarget: null, submitting: false, deletingId: null,
};

export function reducer(state: CustomerOrdersState, action: Action): CustomerOrdersState {
  switch (action.type) {
    case "LOADING":    return { ...state, isLoading: action.value };
    case "ERROR":      return { ...state, error: action.value };
    case "DATA":       return { ...state, items: action.items, total: action.total };
    case "MODE":       return { ...state, mode: action.mode, editTarget: action.editTarget ?? null };
    case "SUBMITTING": return { ...state, submitting: action.value };
    case "DELETING":   return { ...state, deletingId: action.id };
    default:           return state;
  }
}
