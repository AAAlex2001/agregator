"use client";

import { useState } from "react";
import {
  getDesignProfileValues,
  useDesignProfile,
  useSaveDesignProfile,
} from "@/entities/design";

/** Хранит черновик полей отдельно от сохранённой анкеты и документов. */
export function useDesignProfileForm() {
  const { profile } = useDesignProfile();
  const saveProfile = useSaveDesignProfile();
  const [fields, change] = useState(() => getDesignProfileValues(profile));

  /** Сохраняет черновик и принимает нормализованные сервером значения. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getDesignProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
