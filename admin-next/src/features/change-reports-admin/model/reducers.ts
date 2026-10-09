import type { ChangeReportsAction, ChangeReportsState } from "./types";

export const changeReportsReducer = (state: ChangeReportsState, action: ChangeReportsAction): ChangeReportsState => {
  switch (action.type) {
    case "load/start":
      return { ...state, filter: action.filter, loading: true, failed: false };

    case "load/success":
      return { ...state, items: action.items, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    case "request/start":
      return { ...state, pendingId: action.id };

    case "request/finish":
      return { ...state, pendingId: null };

    case "report/changed":
      return { ...state, items: (state.items ?? []).map((item) => (item.id === action.report.id ? action.report : item)) };

    default:
      return state;
  }
};
