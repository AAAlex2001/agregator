"use client";

import { useState } from "react";
import { updateEmailPreferences, type EmailPreferences, type UserProfile } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { EMAIL_EVENTS } from "./events";

/** Письма по событиям: список под роль и переключатель, который сохраняется сразу. */
export function useEmailEvents(profile: UserProfile) {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [savingKey, setSavingKey] = useState<keyof EmailPreferences | null>(null);

  const events = EMAIL_EVENTS.filter((event) => event.roles.includes(profile.role));

  const toggle = async (key: keyof EmailPreferences, enabled: boolean) => {
    setSavingKey(key);
    try {
      setUser(await updateEmailPreferences({ ...profile.email_preferences, [key]: enabled }));
      showSuccess(enabled ? "Уведомление включено" : "Уведомление отключено");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSavingKey(null);
    }
  };

  return { events, savingKey, toggle };
}
