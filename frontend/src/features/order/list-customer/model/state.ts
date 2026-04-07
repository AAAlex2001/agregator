import { useReducer, useCallback } from "react";
import type { CustomerOrderCardVM, CustomerOrdersState } from "./types";

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: CustomerOrderCardVM[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "PREPEND_ORDER"; payload: CustomerOrderCardVM }
  | { type: "RESET" };

const initialState: CustomerOrdersState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
};

function reducer(state: CustomerOrdersState, action: Action): CustomerOrdersState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_ORDERS":
      return { ...state, items: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "PREPEND_ORDER":
      return {
        ...state,
        items: [action.payload, ...state.items],
        total: state.total + 1,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useCustomerOrdersState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = useCallback(
    (loading: boolean) => dispatch({ type: "SET_LOADING", payload: loading }),
    [],
  );
  const setError = useCallback(
    (error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
    [],
  );
  const setOrders = useCallback(
    (orders: CustomerOrderCardVM[]) =>
      dispatch({ type: "SET_ORDERS", payload: orders }),
    [],
  );
  const setTotal = useCallback(
    (total: number) => dispatch({ type: "SET_TOTAL", payload: total }),
    [],
  );
  const prependOrder = useCallback(
    (order: CustomerOrderCardVM) =>
      dispatch({ type: "PREPEND_ORDER", payload: order }),
    [],
  );

  return {
    ...state,
    setLoading,
    setError,
    setOrders,
    setTotal,
    prependOrder,
  };
}
