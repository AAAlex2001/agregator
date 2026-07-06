import type { ChatThreadAction, ChatThreadState } from "./types";

export const initialState: ChatThreadState = {
  detail: null,
  text: "",
  files: [],
  sending: false,
};

export function reducer(state: ChatThreadState, action: ChatThreadAction): ChatThreadState {
  switch (action.type) {
    case "loaded":
      return { ...state, detail: action.detail };
    case "received":
      if (!state.detail || state.detail.messages.some((m) => m.id === action.message.id)) return state;
      return { ...state, detail: { ...state.detail, messages: [...state.detail.messages, action.message] } };
    case "text":
      return { ...state, text: action.value };
    case "addFiles":
      return { ...state, files: [...state.files, ...action.files] };
    case "removeFile":
      return { ...state, files: state.files.filter((_, i) => i !== action.index) };
    case "sending":
      return { ...state, sending: action.value };
    case "sent":
      return {
        ...state,
        text: "",
        files: [],
        sending: false,
        detail:
          state.detail && !state.detail.messages.some((m) => m.id === action.message.id)
            ? { ...state.detail, messages: [...state.detail.messages, action.message] }
            : state.detail,
      };
    case "reset":
      return initialState;
  }
}
