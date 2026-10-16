"use client";

import { useState } from "react";
import { markNotificationsIntroduced } from "../api/mark-notifications-introduced";
import { useUser } from "./use-user";

/** Сохраняет знакомство с уведомлениями и обновляет текущий аккаунт. */
export function useIntroduceNotifications() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Применяет ответ сервера только к аккаунту, который всё ещё открыт. */
  async function markIntroduced() {
    setIsSaving(true);

    try {
      const profile = await markNotificationsIntroduced();
      updateUser(profile);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    markIntroduced,
  };
}
