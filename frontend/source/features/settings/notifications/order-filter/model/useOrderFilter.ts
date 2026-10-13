"use client";

import { useState } from "react";
import { updateOrderNotifications } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

/** Фильтр писем о новых заказах: каждое изменение выбора сохраняется сразу. */
export function useOrderFilter() {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  const change = async (orderTypes: string[]) => {
    setIsSaving(true);
    try {
      setUser(await updateOrderNotifications(orderTypes));
      showSuccess(orderTypes.length ? "Фильтр уведомлений сохранён" : "Уведомления о новых заказах отключены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить фильтр");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, change };
}
