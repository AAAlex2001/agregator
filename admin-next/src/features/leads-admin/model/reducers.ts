import type { LeadsAction, LeadsState } from "./types";

export const leadsReducer = (state: LeadsState, action: LeadsAction): LeadsState => {
  switch (action.type) {
    case "load/start":
      return { ...state, filter: action.filter, page: action.page, loading: true, failed: false };

    case "load/success":
      return { ...state, list: action.list, loading: false };

    case "load/error":
      return { ...state, loading: false, failed: true };

    case "request/start":
      return { ...state, pendingId: action.id };

    case "request/finish":
      return { ...state, pendingId: null };

    case "lead/changed":
      return {
        ...state,
        noteFor: null,
        noteDraft: "",
        list: state.list && {
          ...state.list,
          items: state.list.items.map((item) => (item.id === action.lead.id ? action.lead : item)),
        },
      };

    case "note/open":
      return { ...state, noteFor: action.lead.id, noteDraft: action.lead.comment };

    case "note/change":
      return { ...state, noteDraft: action.value };

    case "note/close":
      return { ...state, noteFor: null, noteDraft: "" };

    case "remove/ask":
      return { ...state, removing: action.lead };

    case "remove/cancel":
      return { ...state, removing: null };

    case "lead/removed":
      return {
        ...state,
        removing: null,
        list: state.list && {
          items: state.list.items.filter((item) => item.id !== action.id),
          total: state.list.total - 1,
        },
      };

    default:
      return state;
  }
};
