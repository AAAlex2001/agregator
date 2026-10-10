import type { AccountsAction, AccountsState } from "./types";

export const accountsReducer = (state: AccountsState, action: AccountsAction): AccountsState => {
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
