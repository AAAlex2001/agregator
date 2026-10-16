import type { ResearchProfile } from "./types";

/** Сохранённая научная квалификация и состояние её записи на сервер. */
export interface ResearchProfileState {
  profile: ResearchProfile;
  isSaving: boolean;
}

/** Начало сохранения, подтверждённая анкета и завершение запроса. */
export type ResearchProfileAction =
  | { type: "save/started" }
  | { type: "profile/saved"; profile: ResearchProfile }
  | { type: "save/finished" };

/** Использует загруженную анкету без повторного запроса при открытии формы. */
export function createResearchProfileState(
  profile: ResearchProfile,
): ResearchProfileState {
  return {
    profile,
    isSaving: false,
  };
}

/** Заменяет сохранённые поля только после успешного ответа сервера. */
export function researchProfileReducer(
  state: ResearchProfileState,
  action: ResearchProfileAction,
): ResearchProfileState {
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
