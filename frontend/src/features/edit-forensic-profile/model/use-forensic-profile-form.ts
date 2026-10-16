"use client";

import { useState } from "react";
import {
  getForensicProfileValues,
  useForensicProfile,
  useSaveForensicProfile,
} from "@/entities/forensic";

/** Хранит редактируемые сведения эксперта отдельно от сохранённых файлов. */
export function useForensicProfileForm() {
  const { profile } = useForensicProfile();
  const saveProfile = useSaveForensicProfile();
  const [fields, change] = useState(() => getForensicProfileValues(profile));

  /** Обновляет поля ответом API, оставляя черновик при ошибке. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getForensicProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
