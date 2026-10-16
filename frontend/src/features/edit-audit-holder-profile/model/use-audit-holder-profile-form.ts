"use client";

import { useState } from "react";
import { useSaveAuditHolderProfile } from "@/entities/audit";
import type { AuditHolderProfileValues } from "@/entities/audit";

/** Хранит свидетельство и области аккредитации до сохранения анкеты. */
export function useAuditHolderProfileForm(
  initialProfile: AuditHolderProfileValues,
) {
  const [fields, change] = useState(initialProfile);
  const { isSaving, saveProfile } = useSaveAuditHolderProfile();

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
