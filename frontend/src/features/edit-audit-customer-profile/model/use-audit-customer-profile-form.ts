"use client";

import { useState } from "react";
import { useSaveAuditCustomerProfile } from "@/entities/audit";
import type { AuditCustomerProfileValues } from "@/entities/audit";

/** Хранит должность и лицензию заказчика до сохранения анкеты. */
export function useAuditCustomerProfileForm(
  initialProfile: AuditCustomerProfileValues,
) {
  const [fields, change] = useState(initialProfile);
  const { isSaving, saveProfile } = useSaveAuditCustomerProfile();

  /** Применяет ответ сервера только после успешного сохранения анкеты. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(savedProfile);
    }
  }

  return {
    fields,
    isSaving,
    change,
    save,
  };
}
