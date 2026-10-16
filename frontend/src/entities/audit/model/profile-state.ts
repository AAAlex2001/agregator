import type { AuditDocument, AuditExpertProfile } from "./types";

/** Сохранённая анкета аудитора и текущая операция. */
export interface AuditExpertProfileState {
  profile: AuditExpertProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** События сохранения сведений и изменения документов аудитора. */
export type AuditExpertProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: AuditExpertProfile }
  | { type: "documents/updated"; documents: AuditDocument[] };

/** Начинает редактирование загруженной анкеты аудитора. */
export function createAuditExpertProfileState(
  profile: AuditExpertProfile,
): AuditExpertProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые сведения и документы отдельно от полей формы. */
export function auditExpertProfileReducer(
  state: AuditExpertProfileState,
  action: AuditExpertProfileAction,
): AuditExpertProfileState {
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
