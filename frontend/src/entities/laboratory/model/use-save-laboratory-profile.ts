"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateLaboratoryProfile } from "../api/update-laboratory-profile";
import { useLaboratoryProfileContext } from "./profile-provider";
import type { LaboratoryProfile, LaboratoryProfileValues } from "./types";

/** Сохраняет сведения лаборатории и обновляет подтверждённую анкету. */
export function useSaveLaboratoryProfile() {
  const { state, dispatch } = useLaboratoryProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённые поля для обновления черновика формы. */
  async function saveProfile(
    fields: LaboratoryProfileValues,
  ): Promise<LaboratoryProfile | null> {
    if (state.isSaving) {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateLaboratoryProfile(fields);

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
