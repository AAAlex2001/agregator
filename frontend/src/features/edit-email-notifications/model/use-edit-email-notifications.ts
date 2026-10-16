"use client";

import { useUpdateEmailPreferences } from "@/entities/user";
import type { EmailPreferences, UserProfile } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { EMAIL_EVENTS } from "../config/events";
import type { EmailNotificationsOptions } from "./types";

/** Сохраняет переключатель события и сообщает результат в уведомлении. */
export function useEditEmailNotifications(
  profile: UserProfile,
  { disabled, onBusyChange }: EmailNotificationsOptions,
) {
  const { isSaving, savePreferences } = useUpdateEmailPreferences();
  const { showError, showSuccess } = useNotifications();
  const events = EMAIL_EVENTS.filter((event) => event.roles.includes(profile.role));

  /** Меняет одно событие, сохраняя остальные настройки текущего профиля. */
  async function changeEvent(key: keyof EmailPreferences, enabled: boolean) {
    if (disabled || isSaving) {
      return;
    }

    onBusyChange?.(true);

    try {
      await savePreferences({
        ...profile.email_preferences,
        [key]: enabled,
      });
      showSuccess(enabled ? "Уведомление включено" : "Уведомление отключено");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить",
      );
    } finally {
      onBusyChange?.(false);
    }
  }

  return {
    events,
    isSaving,
    changeEvent,
  };
}
