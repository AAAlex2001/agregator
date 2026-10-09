import type { Tag } from "@/entities/tag";
import type { TagsAction, TagsState } from "./types";

const byName = (left: Tag, right: Tag) => left.name.localeCompare(right.name, "ru");

export const tagsReducer = (state: TagsState, action: TagsAction): TagsState => {
  switch (action.type) {
    case "load/success":
      return { ...state, tags: [...action.tags].sort(byName) };

    case "load/error":
      return { ...state, failed: true };

    case "draft/change":
      return { ...state, draft: action.value };

    case "edit/open":
      return { ...state, editing: action.tag, editingName: action.tag.name };

    case "edit/change":
      return { ...state, editingName: action.value };

    case "edit/close":
      return { ...state, editing: null, editingName: "" };

    case "remove/ask":
      return { ...state, removing: action.tag };

    case "remove/cancel":
      return { ...state, removing: null };

    case "request/start":
      return { ...state, pending: true };

    case "request/finish":
      return { ...state, pending: false };

    case "tag/created":
      return { ...state, draft: "", tags: [...(state.tags ?? []), action.tag].sort(byName) };

    case "tag/renamed":
      return {
        ...state,
        editing: null,
        editingName: "",
        tags: (state.tags ?? []).map((tag) => (tag.id === action.tag.id ? action.tag : tag)).sort(byName),
      };

    case "tag/removed":
      return { ...state, removing: null, tags: (state.tags ?? []).filter((tag) => tag.id !== action.id) };

    default:
      return state;
  }
};
