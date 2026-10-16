"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";
import { updateAuditCustomerProfile } from "../api/update-audit-customer-profile";
import type { AuditCustomerProfileValues } from "./types";

/** Сохраняет анкету заказчика аудита и сообщает состояние запроса. */
export function useSaveAuditCustomerProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Возвращает сохранённую анкету; при ошибке введённые поля остаются в форме. */
  async function saveProfile(
    fields: AuditCustomerProfileValues,
  ): Promise<AuditCustomerProfileValues | null> {
    if (isSaving) {
      return null;
    }

    setIsSaving(true);

    try {
      const profile = await updateAuditCustomerProfile(fields);

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
