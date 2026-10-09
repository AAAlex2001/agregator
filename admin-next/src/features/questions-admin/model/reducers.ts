import type { QuestionsAction, QuestionsState } from "./types";

export const questionsReducer = (state: QuestionsState, action: QuestionsAction): QuestionsState => {
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

    case "question/changed":
      return {
        ...state,
        dismissing: null,
        dismissReason: "",
        items: (state.items ?? []).map((item) => (item.id === action.question.id ? action.question : item)),
      };

    case "question/removed":
      return { ...state, removing: null, items: (state.items ?? []).filter((item) => item.id !== action.id) };

    case "dismiss/open":
      return { ...state, dismissing: action.question, dismissReason: "" };

    case "dismiss/change":
      return { ...state, dismissReason: action.value };

    case "dismiss/close":
      return { ...state, dismissing: null, dismissReason: "" };

    case "remove/ask":
      return { ...state, removing: action.question };

    case "remove/cancel":
      return { ...state, removing: null };

    default:
      return state;
  }
};
