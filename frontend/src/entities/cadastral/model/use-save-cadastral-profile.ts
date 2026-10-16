"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateCadastralProfile } from "../api/update-cadastral-profile";
import { useCadastralProfileContext } from "./profile-provider";
import type { CadastralProfile, CadastralProfileValues } from "./types";

/** Сохраняет сведения инженера и возвращает подтверждённую анкету форме. */
export function useSaveCadastralProfile() {
  const { state, dispatch } = useCadastralProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API; при ошибке оставляет прежнюю анкету и черновик. */
  async function saveProfile(
    fields: CadastralProfileValues,
  ): Promise<CadastralProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateCadastralProfile(fields);

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
