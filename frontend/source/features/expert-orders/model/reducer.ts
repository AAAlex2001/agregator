import type { OrderCardData } from "@/source/entities/order";
import type { ExpertOrdersState } from "./types";

export type Action =
  | { type: "LOADING"; value: boolean }
  | { type: "LOADING_MORE"; value: boolean }
  | { type: "ERROR"; value: string | null }
  | { type: "DATA"; items: OrderCardData[]; hasMore: boolean }
  | { type: "APPEND"; items: OrderCardData[]; hasMore: boolean }
  | { type: "PREPEND"; item: OrderCardData }
  | { type: "UPDATE"; item: OrderCardData }
  | { type: "REMOVE"; id: number }
  | { type: "SELECT"; order: OrderCardData | null }
  | { type: "RESPONDING"; value: boolean };

export const initial: ExpertOrdersState = {
  items: [], hasMore: false, isLoading: true, isLoadingMore: false,
  error: null, selectedOrder: null, isResponding: false,
};

function uniqueById(arr: OrderCardData[]): OrderCardData[] {
  const seen = new Set<number>();
  return arr.filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
}

export function reducer(state: ExpertOrdersState, action: Action): ExpertOrdersState {
  switch (action.type) {
    case "LOADING":      return { ...state, isLoading: action.value };
    case "LOADING_MORE": return { ...state, isLoadingMore: action.value };
    case "ERROR":        return { ...state, error: action.value };
    case "DATA":         return { ...state, items: uniqueById(action.items), hasMore: action.hasMore };
    case "APPEND":       return { ...state, items: uniqueById([...state.items, ...action.items]), hasMore: action.hasMore };
    case "PREPEND":      return { ...state, items: uniqueById([action.item, ...state.items]) };
    case "UPDATE":       return { ...state, items: state.items.map((i) => i.id === action.item.id ? action.item : i) };
    case "REMOVE":       return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "SELECT":       return { ...state, selectedOrder: action.order };
    case "RESPONDING":   return { ...state, isResponding: action.value };
    default:             return state;
  }
}
