"use client";

import { useState } from "react";
import { updateEmailPreferences } from "../api/update-email-preferences";
import type { EmailPreferences } from "./types";
import { useUser } from "./use-user";

/** Сохраняет настройки событий и сразу применяет результат в общем профиле. */
export function useUpdateEmailPreferences() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Применяет сохранённые настройки только к текущему аккаунту. */
  async function savePreferences(preferences: EmailPreferences) {
    setIsSaving(true);

    try {
      const user = await updateEmailPreferences(preferences);
      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    savePreferences,
  };
}
