"use client";

import { useState } from "react";
import {
  getAuditExpertProfileValues,
  useAuditExpertProfile,
  useSaveAuditExpertProfile,
} from "@/entities/audit";

/** Хранит редактируемые сведения аудитора отдельно от документов. */
export function useAuditProfileForm() {
  const { profile } = useAuditExpertProfile();
  const saveProfile = useSaveAuditExpertProfile();
  const [fields, change] = useState(() => getAuditExpertProfileValues(profile));

  /** Применяет сохранённые сведения, оставляя введённые поля при ошибке. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getAuditExpertProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
