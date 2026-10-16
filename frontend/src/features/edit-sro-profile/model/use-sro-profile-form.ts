"use client";

import { useState } from "react";
import {
  getSroProfileValues,
  useSaveSroProfile,
  useSroProfile,
} from "@/entities/sro";

/** Хранит редактируемые сведения члена СРО отдельно от документов. */
export function useSroProfileForm() {
  const { profile } = useSroProfile();
  const saveProfile = useSaveSroProfile();
  const [fields, change] = useState(() => getSroProfileValues(profile));

  /** Применяет сохранённые сведения, оставляя введённые поля при ошибке. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getSroProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
