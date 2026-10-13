import type { InboxAction, InboxState } from "./types";

export const INITIAL_STATE: InboxState = {
  items: [],
  hasMore: false,
  isLoading: true,
  loadError: null,
  isLoadingMore: false,
  pending: null,
  bulk: null,
};

export function inboxReducer(state: InboxState, action: InboxAction): InboxState {
  switch (action.type) {
    case "load/success":
      return { ...state, items: action.items, hasMore: action.hasMore, isLoading: false };
    case "load/error":
      return { ...state, loadError: action.error, isLoading: false };
    case "more/start":
      return { ...state, isLoadingMore: true };
    case "more/success":
      return { ...state, items: [...state.items, ...action.items], hasMore: action.hasMore };
    case "more/finish":
      return { ...state, isLoadingMore: false };
    case "item/start":
      return { ...state, pending: { id: action.id, kind: action.kind } };
    case "item/finish":
      return { ...state, pending: null };
    case "item/read":
      return { ...state, items: state.items.map((item) => (item.id === action.item.id ? action.item : item)) };
    case "item/removed":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "bulk/start":
      return { ...state, bulk: action.kind };
    case "bulk/finish":
      return { ...state, bulk: null };
    case "bulk/read":
      return { ...state, items: state.items.map((item) => ({ ...item, is_read: true })) };
    case "bulk/removed":
      return { ...state, items: [], hasMore: false };
  }
}
