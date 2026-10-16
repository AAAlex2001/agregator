"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateEcologyProfile } from "../api/update-ecology-profile";
import { useEcologyProfileContext } from "./profile-provider";
import type { EcologyProfileValues } from "./types";

/** Сохраняет редактируемые поля и принимает нормализованную анкету сервера. */
export function useSaveEcologyProfile() {
  const { state, dispatch } = useEcologyProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету для обновления черновика формы. */
  async function saveProfile(fields: EcologyProfileValues) {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateEcologyProfile(fields);

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
