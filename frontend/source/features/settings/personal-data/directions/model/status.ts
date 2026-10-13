export interface DirectionStatus {
  loadError: string | null;
  isSaving: boolean;
  isUploading: boolean;
}

export type DirectionStatusAction =
  | { type: "load/error"; error: string }
  | { type: "save/start" }
  | { type: "save/finish" }
  | { type: "upload/start" }
  | { type: "upload/finish" };

export const INITIAL_STATUS: DirectionStatus = { loadError: null, isSaving: false, isUploading: false };

/** Состояние карточки анкеты: не загрузилась, сохраняется, грузит файлы. Сама анкета хранится отдельно. */
export function statusReducer(state: DirectionStatus, action: DirectionStatusAction): DirectionStatus {
  switch (action.type) {
    case "load/error":
      return { ...state, loadError: action.error };
    case "save/start":
      return { ...state, isSaving: true };
    case "save/finish":
      return { ...state, isSaving: false };
    case "upload/start":
      return { ...state, isUploading: true };
    case "upload/finish":
      return { ...state, isUploading: false };
    default:
      return state;
  }
}
