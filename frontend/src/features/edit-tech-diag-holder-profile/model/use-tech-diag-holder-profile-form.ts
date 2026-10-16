"use client";

import { useState } from "react";
import { useSaveTechDiagHolderProfile } from "@/entities/tech-diag";
import type { TechDiagHolderProfile } from "@/entities/tech-diag";

/** Хранит виды контроля и город лаборатории до сохранения анкеты. */
export function useTechDiagHolderProfileForm(
  initialProfile: TechDiagHolderProfile,
) {
  const [fields, change] = useState(initialProfile);
  const { isSaving, saveProfile } = useSaveTechDiagHolderProfile();

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
