"use client";

import { useState } from "react";
import { useSaveExpertiseProfile } from "@/entities/expertise";
import type { ExpertiseProfileValues } from "@/entities/expertise";

/** Хранит редактируемые удостоверения эксперта до сохранения анкеты. */
export function useExpertiseProfileForm(initialProfile: ExpertiseProfileValues) {
  const [fields, change] = useState(initialProfile);
  const { isSaving, saveProfile } = useSaveExpertiseProfile();

  /** Применяет ответ сервера только после успешного сохранения удостоверений. */
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
