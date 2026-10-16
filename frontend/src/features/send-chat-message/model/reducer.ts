import type { SendChatMessageAction, SendChatMessageState } from "./types";

/** Пустой черновик сообщения. */
export const INITIAL_SEND_CHAT_MESSAGE_STATE: SendChatMessageState = {
  text: "",
  files: [],
  clientMessageId: null,
  isSending: false,
  progress: 0,
};

/** Обновляет черновик сообщения; изменённый черновик получает новый clientMessageId. */
export function sendChatMessageReducer(
  state: SendChatMessageState,
  action: SendChatMessageAction,
): SendChatMessageState {
  switch (action.type) {
    case "text/change":
      return {
        ...state,
        text: action.value,
        clientMessageId: null,
      };
    case "files/add":
      return {
        ...state,
        files: [...state.files, ...action.files],
        clientMessageId: null,
      };
    case "files/remove":
      return {
        ...state,
        files: state.files.filter((item) => item !== action.file),
        clientMessageId: null,
      };
    case "submit/start":
      return {
        ...state,
        clientMessageId: action.clientMessageId,
        isSending: true,
        progress: 0,
      };
    case "submit/progress":
      return {
        ...state,
        progress: action.progress,
      };
    case "submit/success":
      return INITIAL_SEND_CHAT_MESSAGE_STATE;
    case "submit/error":
      return {
        ...state,
        isSending: false,
      };
  }
}
