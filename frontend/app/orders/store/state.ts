import { useReducer } from "react";
import type { OrderCardViewModel, OrdersState } from "./types";

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: OrderCardViewModel[] }
  | { type: "APPEND_ORDERS"; payload: OrderCardViewModel[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "RESET" };

const initialState: OrdersState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

function uniqueById(items: OrderCardViewModel[]): OrderCardViewModel[] {
  const seen = new Set<number>();
  const uniqueItems: OrderCardViewModel[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    uniqueItems.push(item);
  }

  return uniqueItems;
}

function reducer(state: OrdersState, action: Action): OrdersState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ORDERS":
      return { ...state, items: uniqueById(action.payload) };
    case "APPEND_ORDERS":
      return { ...state, items: uniqueById([...state.items, ...action.payload]) };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useOrdersState(): OrdersState & {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOrders: (orders: OrderCardViewModel[]) => void;
  appendOrders: (orders: OrderCardViewModel[]) => void;
  setTotal: (total: number) => void;
  reset: () => void;
} {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading });
  const setError = (error: string | null) => dispatch({ type: "SET_ERROR", payload: error });
  const setOrders = (orders: OrderCardViewModel[]) => dispatch({ type: "SET_ORDERS", payload: orders });
  const appendOrders = (orders: OrderCardViewModel[]) => dispatch({ type: "APPEND_ORDERS", payload: orders });
  const setTotal = (total: number) => dispatch({ type: "SET_TOTAL", payload: total });
  const reset = () => dispatch({ type: "RESET" });

  return {
    ...state,
    setLoading,
    setError,
    setOrders,
    appendOrders,
    setTotal,
    reset,
  };
}
