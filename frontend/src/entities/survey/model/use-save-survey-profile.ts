"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateSurveyProfile } from "../api/update-survey-profile";
import { useSurveyProfileContext } from "./profile-provider";
import type { SurveyProfile, SurveyProfileValues } from "./types";

/** Сохраняет сведения изыскателя и возвращает подтверждённую анкету форме. */
export function useSaveSurveyProfile() {
  const { state, dispatch } = useSurveyProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API только после успешного сохранения полей. */
  async function saveProfile(
    fields: SurveyProfileValues,
  ): Promise<SurveyProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateSurveyProfile(fields);

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
        type: "request/finished",
      });
    }
  }

  return saveProfile;
}
