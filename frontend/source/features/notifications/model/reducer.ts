import type { NotificationsAction, NotificationsState } from "./types";

export const initialNotificationsState: NotificationsState = {
  items: [],
  total: 0,
  unreadCount: 0,
  isLoading: true,
  error: null,
  pendingId: null,
  pendingMode: null,
  isMarkingAll: false,
};

export function notificationsReducer(
  state: NotificationsState,
  action: NotificationsAction,
): NotificationsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_DATA":
      return {
        ...state,
        items: action.items,
        total: action.total,
        unreadCount: action.unreadCount,
      };
    case "SET_PENDING":
      return { ...state, pendingId: action.id, pendingMode: action.mode };
    case "SET_MARKING_ALL":
      return { ...state, isMarkingAll: action.payload };
    case "UPSERT_ITEM": {
      const nextItems = state.items.map((item) => (
        item.id === action.payload.id ? action.payload : item
      ));
      return { ...state, items: nextItems };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: Math.max(state.total - 1, 0),
      };
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "MARK_ALL_READ":
      return {
        ...state,
        items: state.items.map((item) => (
          item.is_read ? item : { ...item, is_read: true }
        )),
      };
    default:
      return state;
  }
}