import type { EcologyDocument, EcologyProfile } from "./types";

/** Сохранённая анкета и одна выполняемая операция; черновик принадлежит форме. */
export interface EcologyProfileState {
  profile: EcologyProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** Начало запроса и применение сохранённых полей или документов. */
export type EcologyProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: EcologyProfile }
  | { type: "documents/updated"; documents: EcologyDocument[] };

/** Создаёт состояние уже загруженной анкеты эколога. */
export function createEcologyProfileState(
  profile: EcologyProfile,
): EcologyProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Обновляет серверные данные, не смешивая их с черновиком формы. */
export function ecologyProfileReducer(
  state: EcologyProfileState,
  action: EcologyProfileAction,
): EcologyProfileState {
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
