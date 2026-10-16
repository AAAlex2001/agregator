import type { TechDiagDocument, TechDiagProfile } from "./types";

/** Сохранённая анкета специалиста НК и текущая операция. */
export interface TechDiagProfileState {
  profile: TechDiagProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** События сохранения сведений и изменения документов специалиста НК. */
export type TechDiagProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: TechDiagProfile }
  | { type: "documents/updated"; documents: TechDiagDocument[] };

/** Начинает редактирование загруженной анкеты специалиста НК. */
export function createTechDiagProfileState(
  profile: TechDiagProfile,
): TechDiagProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые сведения и документы отдельно от полей формы. */
export function techDiagProfileReducer(
  state: TechDiagProfileState,
  action: TechDiagProfileAction,
): TechDiagProfileState {
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
