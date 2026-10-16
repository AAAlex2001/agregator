"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateResearchProfile } from "../api/update-research-profile";
import { useResearchProfileContext } from "./profile-provider";
import type { ResearchProfile, ResearchProfileValues } from "./types";

/** Сохраняет научную квалификацию и применяет подтверждённые сервером поля. */
export function useSaveResearchProfile() {
  const { state, dispatch } = useResearchProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету для обновления черновика формы. */
  async function saveProfile(
    fields: ResearchProfileValues,
  ): Promise<ResearchProfile | null> {
    if (state.isSaving) {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateResearchProfile(fields);

      dispatch({
        type: "profile/saved",
        profile,
      });
      showSuccess("Анкета сохранена");
      return profile;
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить анкету",
      );
      return null;
    } finally {
      dispatch({
        type: "save/finished",
      });
    }
  }

  return saveProfile;
}
