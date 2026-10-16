import type { SurveyProfile, SurveyProfileDocuments } from "./types";

/** Сохранённая анкета изыскателя и текущая операция. */
export interface SurveyProfileState {
  profile: SurveyProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** События сохранения сведений и обновления пяти групп документов. */
export type SurveyProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: SurveyProfile }
  | { type: "documents/updated"; documents: SurveyProfileDocuments };

/** Начинает редактирование уже загруженной анкеты изыскателя. */
export function createSurveyProfileState(
  profile: SurveyProfile,
): SurveyProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые сервером сведения отдельно от черновика формы. */
export function surveyProfileReducer(
  state: SurveyProfileState,
  action: SurveyProfileAction,
): SurveyProfileState {
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
          education_documents: action.documents.education_documents,
          nok_documents: action.documents.nok_documents,
          nrs_documents: action.documents.nrs_documents,
          qualification_documents: action.documents.qualification_documents,
          rtn_documents: action.documents.rtn_documents,
        },
      };
  }
}

