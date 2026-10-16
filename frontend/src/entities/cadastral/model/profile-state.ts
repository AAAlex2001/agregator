import type { CadastralProfile } from "./types";

/** Сохранённая анкета инженера и текущая операция над полями или файлами. */
export interface CadastralProfileState {
  profile: CadastralProfile;
  operation: "idle" | "saving" | "uploading" | "deleting";
}

/** Начало запроса и применение подтверждённых сервером данных. */
export type CadastralProfileAction =
  | { type: "save/started" }
  | { type: "upload/started" }
  | { type: "delete/started" }
  | { type: "request/finished" }
  | { type: "profile/saved"; profile: CadastralProfile }
  | { type: "files/updated"; profile: CadastralProfile };

/** Принимает загруженную анкету при открытии редактора. */
export function createCadastralProfileState(
  profile: CadastralProfile,
): CadastralProfileState {
  return {
    profile,
    operation: "idle",
  };
}

/** Обновляет документы отдельно от полей, чтобы загрузка не стирала черновик. */
export function cadastralProfileReducer(
  state: CadastralProfileState,
  action: CadastralProfileAction,
): CadastralProfileState {
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
          certificate_file: action.profile.certificate_file,
          documents: action.profile.documents,
        },
      };
  }
}
