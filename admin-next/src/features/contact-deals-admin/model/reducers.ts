import type { DealAction, DealsAction, DealsState, DealState } from "./types";

export const dealsReducer = (state: DealsState, action: DealsAction): DealsState => {
  switch (action.type) {
    case "load/start":
      return { ...state, filter: action.filter, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    default:
      return state;
  }
};

export const dealReducer = (state: DealState, action: DealAction): DealState => {
  switch (action.type) {
    case "load/success":
      return { ...state, status: "ready", deal: action.deal };

    case "load/error":
      return { ...state, status: "failed" };

    case "note/change":
      return { ...state, note: action.value };

    case "release/start":
      return { ...state, pending: true };

    case "release/finish":
      return { ...state, pending: false };

    default:
      return state;
  }
};
