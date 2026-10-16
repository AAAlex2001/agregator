"use client";

import { useState } from "react";
import {
  getTechDiagProfileValues,
  useSaveTechDiagProfile,
  useTechDiagProfile,
} from "@/entities/tech-diag";

/** Хранит редактируемые сведения специалиста НК отдельно от документов. */
export function useTechDiagProfileForm() {
  const { profile } = useTechDiagProfile();
  const saveProfile = useSaveTechDiagProfile();
  const [fields, change] = useState(() => getTechDiagProfileValues(profile));

  /** Применяет сохранённые сведения, оставляя введённые поля при ошибке. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getTechDiagProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
