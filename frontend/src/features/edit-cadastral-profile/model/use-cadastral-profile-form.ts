"use client";

import { useState } from "react";
import {
  getCadastralProfileValues,
  useCadastralProfile,
  useSaveCadastralProfile,
} from "@/entities/cadastral";

/** Хранит черновик сведений инженера отдельно от загружаемых файлов. */
export function useCadastralProfileForm() {
  const { profile } = useCadastralProfile();
  const saveProfile = useSaveCadastralProfile();
  const [fields, change] = useState(() => getCadastralProfileValues(profile));

  /** Заменяет черновик серверными значениями только после успешного сохранения. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getCadastralProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
