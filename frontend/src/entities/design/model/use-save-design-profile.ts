"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateDesignProfile } from "../api/update-design-profile";
import { useDesignProfileContext } from "./profile-provider";
import type { DesignProfile, DesignProfileValues } from "./types";

/** Сохраняет сведения проектировщика и возвращает подтверждённую анкету форме. */
export function useSaveDesignProfile() {
  const { state, dispatch } = useDesignProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API только после успешного сохранения полей. */
  async function saveProfile(
    fields: DesignProfileValues,
  ): Promise<DesignProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateDesignProfile(fields);

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
