import type { ResponseCardData, ResponseCounters, ResponseTabKey } from "@/source/entities/response";

type ActionMode = "withdraw" | "start" | "complete" | "chat" | null;

export interface State {
  items: ResponseCardData[];
  counters: ResponseCounters;
  isLoading: boolean;
  error: string | null;
  activeTab: ResponseTabKey;
  actionLoading: Record<number, ActionMode>;
  editing: ResponseCardData | null;
  editSubmitting: boolean;
  withdrawTarget: ResponseCardData | null;
}

export type Action =
  | { type: "LOADING"; value: boolean }
  | { type: "ERROR"; value: string | null }
  | { type: "DATA"; items: ResponseCardData[]; counters: ResponseCounters }
  | { type: "TAB"; tab: ResponseTabKey }
  | { type: "ACTION_LOADING"; id: number; mode: ActionMode }
  | { type: "EDITING"; value: ResponseCardData | null }
  | { type: "EDIT_SUBMITTING"; value: boolean }
  | { type: "WITHDRAW_TARGET"; value: ResponseCardData | null };

export const initial: State = {
  items: [],
  counters: { review: 0, in_progress: 0, rejected: 0, accepted: 0, completed: 0 },
  isLoading: false,
  error: null,
  activeTab: "review",
  actionLoading: {},
  editing: null,
  editSubmitting: false,
  withdrawTarget: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":          return { ...state, isLoading: action.value };
    case "ERROR":            return { ...state, error: action.value };
    case "DATA":             return { ...state, items: action.items, counters: action.counters };
    case "TAB":              return { ...state, activeTab: action.tab };
    case "ACTION_LOADING":   return { ...state, actionLoading: { ...state.actionLoading, [action.id]: action.mode } };
    case "EDITING":          return { ...state, editing: action.value };
    case "EDIT_SUBMITTING":  return { ...state, editSubmitting: action.value };
    case "WITHDRAW_TARGET":  return { ...state, withdrawTarget: action.value };
    default:                 return state;
  }
}
