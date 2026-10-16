"use client";

import { useState } from "react";
import { updateOrderNotifications } from "../api/update-order-notifications";
import { useUser } from "./use-user";

/** Сохраняет фильтр писем о новых заказах и обновляет профиль. */
export function useUpdateOrderNotifications() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Применяет сохранённую подписку только к текущему аккаунту. */
  async function saveOrderTypes(orderTypes: string[]) {
    setIsSaving(true);

    try {
      const user = await updateOrderNotifications(orderTypes);
      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveOrderTypes,
  };
}
