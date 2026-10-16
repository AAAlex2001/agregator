import type { SendExpertRoomMessageAction, SendExpertRoomMessageState } from "./types";

/** Пустой черновик сообщения всем исполнителям. */
export const INITIAL_SEND_EXPERT_ROOM_MESSAGE_STATE: SendExpertRoomMessageState = {
  text: "",
  files: [],
  isSending: false,
  progress: 0,
};

/** Обновляет черновик сообщения и состояние его отправки. */
export function sendExpertRoomMessageReducer(
  state: SendExpertRoomMessageState,
  action: SendExpertRoomMessageAction,
): SendExpertRoomMessageState {
  switch (action.type) {
    case "text/change":
      return {
        ...state,
        text: action.value,
      };
    case "files/add":
      return {
        ...state,
        files: [...state.files, ...action.files],
      };
    case "files/remove":
      return {
        ...state,
        files: state.files.filter((item) => item !== action.file),
      };
    case "submit/start":
      return {
        ...state,
        isSending: true,
        progress: 0,
      };
    case "submit/progress":
      return {
        ...state,
        progress: action.progress,
      };
    case "submit/success":
      return INITIAL_SEND_EXPERT_ROOM_MESSAGE_STATE;
    case "submit/error":
      return {
        ...state,
        isSending: false,
      };
  }
}
