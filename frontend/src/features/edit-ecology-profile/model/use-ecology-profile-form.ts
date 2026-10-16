"use client";

import { useState } from "react";
import {
  getEcologyProfileValues,
  useEcologyProfile,
  useSaveEcologyProfile,
} from "@/entities/ecology";

/** Хранит выбранные работы и текст навыков отдельно от документов сервера. */
export function useEcologyProfileForm() {
  const { profile } = useEcologyProfile();
  const saveProfile = useSaveEcologyProfile();
  const [fields, change] = useState(() => getEcologyProfileValues(profile));

  /** Принимает нормализованные поля только после успешного сохранения. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getEcologyProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
