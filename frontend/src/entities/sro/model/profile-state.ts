import type { SroDocument, SroProfile } from "./types";

/** Сохранённая анкета члена СРО и текущая операция. */
export interface SroProfileState {
  profile: SroProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** Подтверждённые изменения полей и дополнительных документов члена СРО. */
export type SroProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: SroProfile }
  | { type: "documents/updated"; documents: SroDocument[] };

/** Начинает редактирование загруженной анкеты члена СРО. */
export function createSroProfileState(profile: SroProfile): SroProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые сведения и документы отдельно от полей формы. */
export function sroProfileReducer(
  state: SroProfileState,
  action: SroProfileAction,
): SroProfileState {
  switch (action.type) {
    case "save/started":
      return {
        ...state,
        operation: "saving",
      };
    case "upload/started":
      return {
        ...state,
        operation: "uploading",
      };
    case "delete/started":
      return {
        ...state,
        operation: "deleting",
      };
    case "request/finished":
      return {
        ...state,
        operation: "idle",
      };
    case "profile/saved":
      return {
        ...state,
        profile: action.profile,
      };
    case "documents/updated":
      return {
        ...state,
        profile: {
          ...state.profile,
          documents: action.documents,
        },
      };
  }
}
