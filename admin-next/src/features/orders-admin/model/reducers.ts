import type { OrdersAction, OrdersState } from "./types";

export const ordersReducer = (state: OrdersState, action: OrdersAction): OrdersState => {
  switch (action.type) {
    case "search/change":
      return { ...state, search: action.value };

    case "load/start":
      return { ...state, filters: action.filters, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    default:
      return state;
  }
};
