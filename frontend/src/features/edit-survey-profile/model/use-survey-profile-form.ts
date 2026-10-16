"use client";

import { useState } from "react";
import {
  getSurveyProfileValues,
  useSaveSurveyProfile,
  useSurveyProfile,
} from "@/entities/survey";

/** Хранит редактируемые сведения изыскателя отдельно от документов. */
export function useSurveyProfileForm() {
  const { profile } = useSurveyProfile();
  const saveProfile = useSaveSurveyProfile();
  const [fields, change] = useState(() => getSurveyProfileValues(profile));

  /** Применяет сохранённые сведения, оставляя черновик при ошибке API. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change(getSurveyProfileValues(savedProfile));
    }
  }

  return {
    fields,
    change,
    save,
  };
}
