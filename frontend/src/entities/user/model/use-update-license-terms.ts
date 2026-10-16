"use client";

import { useState } from "react";
import { updateLicenseTerms } from "../api/update-license-terms";
import type { UpdateLicenseTerms } from "./types";
import { useUser } from "./use-user";

/** Сохраняет условия лицензии и обновляет профиль текущего аккаунта. */
export function useUpdateLicenseTerms() {
  const { updateUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  /** Применяет ответ только к аккаунту, который ещё открыт. */
  async function saveTerms(fields: UpdateLicenseTerms) {
    setIsSaving(true);

    try {
      const user = await updateLicenseTerms(fields);

      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveTerms,
  };
}
