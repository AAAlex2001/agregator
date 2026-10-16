import type { DesignProfile, DesignProfileDocuments } from "./types";

/** Сохранённая анкета проектировщика и текущая операция. */
export interface DesignProfileState {
  profile: DesignProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** События сохранения сведений и обновления пяти групп документов. */
export type DesignProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: DesignProfile }
  | { type: "documents/updated"; documents: DesignProfileDocuments };

/** Начинает редактирование уже загруженной анкеты проектировщика. */
export function createDesignProfileState(profile: DesignProfile): DesignProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые сервером сведения отдельно от черновика формы. */
export function designProfileReducer(
  state: DesignProfileState,
  action: DesignProfileAction,
): DesignProfileState {
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
