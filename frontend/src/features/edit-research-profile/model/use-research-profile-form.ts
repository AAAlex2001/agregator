"use client";

import { useState } from "react";
import {
  getResearchProfileValues,
  useResearchProfile,
  useSaveResearchProfile,
} from "@/entities/research";

/** Хранит черновик научной квалификации до подтверждения сохранения. */
export function useResearchProfileForm() {
  const { profile } = useResearchProfile();
  const saveProfile = useSaveResearchProfile();
  const [fields, change] = useState(() => getResearchProfileValues(profile));

  /** Обновляет черновик ответом сервера только после успешного сохранения. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getResearchProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
