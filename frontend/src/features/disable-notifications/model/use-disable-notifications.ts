"use client";

import {
  useUpdateEmailPreferences,
  useUpdateOrderNotifications,
  useUser,
} from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { DISABLED_EMAIL_PREFERENCES } from "../config/email-preferences";
import type { DisableNotificationsOptions } from "./types";

/** Отключает почтовые события, а у исполнителя — ещё и письма о новых заказах. */
export function useDisableNotifications({
  disabled,
  onBusyChange,
}: DisableNotificationsOptions) {
  const { role } = useUser();
  const emailPreferences = useUpdateEmailPreferences();
  const orderNotifications = useUpdateOrderNotifications();
  const { showError, showSuccess } = useNotifications();
  const isPending = emailPreferences.isSaving || orderNotifications.isSaving;

  /** Сохраняет обе подписки последовательно, не откатывая успешный первый запрос. */
  async function disableAll() {
    if (disabled || isPending) {
      return;
    }

    onBusyChange?.(true);

    try {
      await emailPreferences.savePreferences(DISABLED_EMAIL_PREFERENCES);

      if (role === "EXPERT") {
        await orderNotifications.saveOrderTypes([]);
      }

      showSuccess("Все почтовые уведомления отключены");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось отключить уведомления",
      );
    } finally {
      onBusyChange?.(false);
    }
  }

  return {
    isPending,
    disableAll,
  };
}
