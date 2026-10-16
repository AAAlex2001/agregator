"use client";

import { useIntroduceNotifications, useUser } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import type { NotificationsIntroductionOptions } from "./types";

/** Приглашает нового заказчика или исполнителя настроить почтовые уведомления. */
export function useNotificationsIntroduction({
  onOpenSettings,
}: NotificationsIntroductionOptions) {
  const { user, role } = useUser();
  const { isSaving, markIntroduced } = useIntroduceNotifications();
  const { showError } = useNotifications();
  const isOpen = user?.notifications_introduced === false
    && (role === "CUSTOMER" || role === "EXPERT");

  /** Открывает настройки и сохраняет отметку о знакомстве с уведомлениями. */
  async function openSettings() {
    if (isSaving) {
      return;
    }

    onOpenSettings();

    try {
      await markIntroduced();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить отметку",
      );
    }
  }

  return {
    isOpen,
    isSaving,
    openSettings,
  };
}
