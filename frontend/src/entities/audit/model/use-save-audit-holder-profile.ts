"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { updateAuditHolderProfile } from "../api/update-audit-holder-profile";
import type { AuditHolderProfileValues } from "./types";

/** Сохраняет анкету инспекционного органа и сообщает состояние запроса. */
export function useSaveAuditHolderProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету; при ошибке введённые поля остаются в форме. */
  async function saveProfile(
    fields: AuditHolderProfileValues,
  ): Promise<AuditHolderProfileValues | null> {
    if (isSaving) {
      return null;
    }

    setIsSaving(true);

    try {
      const profile = await updateAuditHolderProfile(fields);

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
