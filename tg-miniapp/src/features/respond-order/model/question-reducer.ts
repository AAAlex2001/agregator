import type { QuestionsAction, QuestionsState } from "./question-types";

export const initialState: QuestionsState = {
  items: null,
  text: "",
  anon: true,
  busy: false,
};

export function reducer(state: QuestionsState, action: QuestionsAction): QuestionsState {
  switch (action.type) {
    case "loaded":
      return { ...state, items: action.items };
    case "text":
      return { ...state, text: action.value };
    case "anon":
      return { ...state, anon: action.value };
    case "busy":
      return { ...state, busy: action.value };
    case "added":
      return { ...state, items: [action.item, ...(state.items ?? [])], text: "", busy: false };
  }
}
