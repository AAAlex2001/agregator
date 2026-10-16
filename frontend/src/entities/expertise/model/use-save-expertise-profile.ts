"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { updateExpertiseProfile } from "../api/update-expertise-profile";
import type { ExpertiseProfileValues } from "./types";

/** Сохраняет удостоверения эксперта и сообщает состояние запроса. */
export function useSaveExpertiseProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету; при ошибке форма сохраняет введённые поля. */
  async function saveProfile(
    fields: ExpertiseProfileValues,
  ): Promise<ExpertiseProfileValues | null> {
    if (isSaving) {
      return null;
    }

    setIsSaving(true);

    try {
      const profile = await updateExpertiseProfile(fields);

      showSuccess("Анкета сохранена");
      return profile;
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить анкету",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveProfile,
  };
}
