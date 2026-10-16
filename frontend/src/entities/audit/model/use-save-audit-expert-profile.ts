"use client";

import { useNotifications } from "@/shared/ui/notifications";
import { updateAuditExpertProfile } from "../api/update-audit-expert-profile";
import { useAuditExpertProfileContext } from "./profile-provider";
import type { AuditExpertProfile, AuditExpertProfileValues } from "./types";

/** Сохраняет сведения аудитора и возвращает подтверждённую анкету форме. */
export function useSaveAuditExpertProfile() {
  const { state, dispatch } = useAuditExpertProfileContext();
  const { showError, showSuccess } = useNotifications();

  /** Применяет ответ API только после успешного сохранения полей. */
  async function saveProfile(
    fields: AuditExpertProfileValues,
  ): Promise<AuditExpertProfile | null> {
    if (state.operation !== "idle") {
      return null;
    }

    dispatch({
      type: "save/started",
    });

    try {
      const profile = await updateAuditExpertProfile(fields);

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
