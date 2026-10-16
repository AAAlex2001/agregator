"use client";

import { useState } from "react";
import {
  useLaboratoryProfile,
  useSaveLaboratoryProfile,
} from "@/entities/laboratory";

/** Хранит редактируемую область аккредитации и комментарий лаборатории. */
export function useLaboratoryProfileForm() {
  const { profile } = useLaboratoryProfile();
  const saveProfile = useSaveLaboratoryProfile();
  const [fields, change] = useState(() => ({
    accreditation_area: profile.accreditation_area,
    comment: profile.comment,
  }));

  /** Применяет ответ сохранения, сохраняя введённые поля при ошибке. */
  async function save() {
    const savedProfile = await saveProfile(fields);

    if (savedProfile) {
      change({
        accreditation_area: savedProfile.accreditation_area,
        comment: savedProfile.comment,
      });
    }
  }

  return {
    fields,
    change,
    save,
  };
}
