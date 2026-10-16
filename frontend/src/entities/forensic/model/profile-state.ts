import type { ForensicProfile } from "./types";

/** Сохранённая анкета судебного эксперта и текущая операция. */
export interface ForensicProfileState {
  profile: ForensicProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** События сохранения полей и изменения документов анкеты. */
export type ForensicProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: ForensicProfile }
  | { type: "files/updated"; profile: ForensicProfile };

/** Начинает работу с уже загруженной анкетой эксперта. */
export function createForensicProfileState(
  profile: ForensicProfile,
): ForensicProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Применяет подтверждённые поля или файлы отдельно от черновика формы. */
export function forensicProfileReducer(
  state: ForensicProfileState,
  action: ForensicProfileAction,
): ForensicProfileState {
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
    case "files/updated":
      return {
        ...state,
        profile: {
          ...state.profile,
          education_diploma: action.profile.education_diploma,
          documents: action.profile.documents,
        },
      };
  }
}
