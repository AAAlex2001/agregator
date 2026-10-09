import type { EditorAction, EditorState, ListAction, ListState } from "./types";

export const listReducer = (state: ListState, action: ListAction): ListState => {
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

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "load/success":
      return { ...state, status: "ready", article: action.article, tags: action.tags };

    case "load/error":
      return { ...state, status: "failed" };

    case "fields/change":
      return { ...state, fields: { ...state.fields, ...action.changes } };

    case "save/start":
      return { ...state, pending: true, confirming: false };

    case "save/finish":
      return { ...state, pending: false };

    case "remove/ask":
      return { ...state, confirming: true };

    case "remove/cancel":
      return { ...state, confirming: false };

    default:
      return state;
  }
};
