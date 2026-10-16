import type { LaboratoryProfile } from "./types";

/** Сохранённые сведения лаборатории и состояние их записи. */
export interface LaboratoryProfileState {
  profile: LaboratoryProfile;
  isSaving: boolean;
}

/** События сохранения анкеты лаборатории. */
export type LaboratoryProfileAction =
  | { type: "save/started" }
  | { type: "profile/saved"; profile: LaboratoryProfile }
  | { type: "save/finished" };

/** Принимает загруженную анкету при открытии редактора. */
export function createLaboratoryProfileState(
  profile: LaboratoryProfile,
): LaboratoryProfileState {
  return {
    profile,
    isSaving: false,
  };
}

/** Меняет сохранённые сведения только по успешному ответу API. */
export function laboratoryProfileReducer(
  state: LaboratoryProfileState,
  action: LaboratoryProfileAction,
): LaboratoryProfileState {
  switch (action.type) {
    case "save/started":
      return {
        ...state,
        isSaving: true,
      };
    case "profile/saved":
      return {
        ...state,
        profile: action.profile,
      };
    case "save/finished":
      return {
        ...state,
        isSaving: false,
      };
  }
}
