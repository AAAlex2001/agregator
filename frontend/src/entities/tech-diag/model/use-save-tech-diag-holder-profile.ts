"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { updateTechDiagHolderProfile } from "../api/update-tech-diag-holder-profile";
import type { TechDiagHolderProfile } from "./types";

/** Сохраняет анкету лаборатории НК и сообщает состояние запроса. */
export function useSaveTechDiagHolderProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету; при ошибке введённые поля остаются в форме. */
  async function saveProfile(
    fields: TechDiagHolderProfile,
  ): Promise<TechDiagHolderProfile | null> {
    if (isSaving) {
      return null;
    }

    setIsSaving(true);

    try {
      const profile = await updateTechDiagHolderProfile(fields);

      showSuccess("Анкета сохранена");
      return profile;
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить анкету",
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
