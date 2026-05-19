import type { ResponseCardData, ResponseCounters, ResponseTabKey, SortDir, CustomerSortBy } from "@/source/entities/response";

type ActionMode = "withdraw" | "start" | "complete" | "chat" | "reject" | "accept" | "select" | "restore" | "delete" | null;

export interface State {
  items: ResponseCardData[];
  counters: ResponseCounters;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  activeTab: ResponseTabKey;
  actionLoading: Record<number, ActionMode>;
  editing: ResponseCardData | null;
  editSubmitting: boolean;
  withdrawTarget: ResponseCardData | null;
  rejectTarget: ResponseCardData | null;
  completionModal: boolean;
  reviewModal: boolean;
  reviewTarget: ResponseCardData | null;
  sortBy: CustomerSortBy | null;
  sortDir: SortDir | null;
}

export type Action =
  | { type: "LOADING"; value: boolean }
  | { type: "LOADING_MORE"; value: boolean }
  | { type: "ERROR"; value: string | null }
  | { type: "DATA"; items: ResponseCardData[]; counters: ResponseCounters; hasMore: boolean }
  | { type: "APPEND"; items: ResponseCardData[]; hasMore: boolean }
  | { type: "TAB"; tab: ResponseTabKey }
  | { type: "ACTION_LOADING"; id: number; mode: ActionMode }
  | { type: "EDITING"; value: ResponseCardData | null }
  | { type: "EDIT_SUBMITTING"; value: boolean }
  | { type: "WITHDRAW_TARGET"; value: ResponseCardData | null }
  | { type: "REJECT_TARGET"; value: ResponseCardData | null }
  | { type: "COMPLETION_MODAL"; value: boolean }
  | { type: "REVIEW_MODAL"; value: boolean }
  | { type: "REVIEW_TARGET"; value: ResponseCardData | null }
  | { type: "SORT_BY"; value: CustomerSortBy | null }
  | { type: "SORT_DIR"; value: SortDir | null };

export const initial: State = {
  items: [],
  counters: { all: 0, review: 0, in_progress: 0, rejected: 0, accepted: 0, withdrawn_by_expert: 0 },
  hasMore: false,
  isLoading: true,
  isLoadingMore: false,
  error: null,
  activeTab: "all",
  actionLoading: {},
  editing: null,
  editSubmitting: false,
  withdrawTarget: null,
  rejectTarget: null,
  completionModal: false,
  reviewModal: false,
  reviewTarget: null,
  sortBy: null,
  sortDir: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":          return { ...state, isLoading: action.value };
    case "LOADING_MORE":     return { ...state, isLoadingMore: action.value };
    case "ERROR":            return { ...state, error: action.value };
    case "DATA":             return { ...state, items: action.items, counters: action.counters, hasMore: action.hasMore };
    case "APPEND":           return { ...state, items: [...state.items, ...action.items], hasMore: action.hasMore };
    case "TAB":              return { ...state, activeTab: action.tab };
    case "ACTION_LOADING":   return { ...state, actionLoading: { ...state.actionLoading, [action.id]: action.mode } };
    case "EDITING":          return { ...state, editing: action.value };
    case "EDIT_SUBMITTING":  return { ...state, editSubmitting: action.value };
    case "WITHDRAW_TARGET":  return { ...state, withdrawTarget: action.value };
    case "REJECT_TARGET":    return { ...state, rejectTarget: action.value };
    case "COMPLETION_MODAL": return { ...state, completionModal: action.value };
    case "REVIEW_MODAL":     return { ...state, reviewModal: action.value };
    case "REVIEW_TARGET":    return { ...state, reviewTarget: action.value };
    case "SORT_BY":           return { ...state, sortBy: action.value };
    case "SORT_DIR":          return { ...state, sortDir: action.value };
    default:                 return state;
  }
}
