"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateSroProfile } from "../api/update-sro-profile";
import { useSroProfileContext } from "./profile-provider";
import type { SroProfile, SroProfileValues } from "./types";

/** Сохраняет сведения члена СРО и возвращает подтверждённую анкету форме. */
export function useSaveSroProfile() {
  const { direction, state, dispatch } = useSroProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API только после успешного сохранения полей. */
  async function saveProfile(fields: SroProfileValues): Promise<SroProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateSroProfile(direction, fields);

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
