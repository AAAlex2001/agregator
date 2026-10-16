"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateForensicProfile } from "../api/update-forensic-profile";
import { useForensicProfileContext } from "./profile-provider";
import type { ForensicProfile, ForensicProfileValues } from "./types";

/** Сохраняет сведения судебного эксперта и возвращает анкету форме. */
export function useSaveForensicProfile() {
  const { state, dispatch } = useForensicProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет серверные поля только после успешного сохранения. */
  async function saveProfile(
    fields: ForensicProfileValues,
  ): Promise<ForensicProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateForensicProfile(fields);

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
