"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateTechDiagProfile } from "../api/update-tech-diag-profile";
import { useTechDiagProfileContext } from "./profile-provider";
import type { TechDiagProfile, TechDiagProfileValues } from "./types";

/** Сохраняет сведения специалиста НК и возвращает подтверждённую анкету форме. */
export function useSaveTechDiagProfile() {
  const { state, dispatch } = useTechDiagProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API только после успешного сохранения полей. */
  async function saveProfile(
    fields: TechDiagProfileValues,
  ): Promise<TechDiagProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateTechDiagProfile(fields);

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
