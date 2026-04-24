"use client";

import { useState } from "react";
import type { EmailPreferences, UserProfile } from "@/source/entities/user";
import { updateEmailPreferences } from "../api/notifications.api";
import type { NotificationPreferenceKey } from "./types";

interface ToggleResult {
  profile?: UserProfile;
  successMessage?: string;
  errorMessage?: string;
}

export function useEmailPreferences(profile: UserProfile) {
  const [preferences, setPreferences] = useState<EmailPreferences>(profile.email_preferences);
  const [savingKey, setSavingKey] = useState<NotificationPreferenceKey | null>(null);

  const toggle = async (
    key: NotificationPreferenceKey,
    next: boolean,
  ): Promise<ToggleResult> => {
    const previous = preferences[key];
    if (previous === next) {
      return {};
    }

    setPreferences((state) => ({ ...state, [key]: next }));
    setSavingKey(key);

    try {
      const updated = await updateEmailPreferences({ [key]: next });
      setPreferences(updated.email_preferences);
      return {
        profile: updated,
        successMessage: next ? "Уведомление включено" : "Уведомление отключено",
      };
    } catch (error) {
      setPreferences((state) => ({ ...state, [key]: previous }));
      const errorMessage = error instanceof Error ? error.message : "Не удалось сохранить";
      return { errorMessage };
    } finally {
      setSavingKey(null);
    }
  };

  return {
    preferences,
    savingKey,
    toggle,
  };
}
