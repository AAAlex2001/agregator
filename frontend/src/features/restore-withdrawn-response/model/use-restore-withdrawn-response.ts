"use client";

import { useState } from "react";
import { restoreWithdrawnResponse } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";

/** Возвращает отозванный отклик исполнителя на рассмотрение заказчику. */
export function useRestoreWithdrawnResponse(responseId: number, onRestored: () => void) {
  const [isRestoring, setIsRestoring] = useState(false);
  const { showError } = useNotifications();

  /** Восстанавливает отклик; при ошибке оставляет его отозванным. */
  async function restore() {
    if (isRestoring) {
      return;
    }

    setIsRestoring(true);

    try {
      await restoreWithdrawnResponse(responseId);
      onRestored();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось восстановить отклик");
    } finally {
      setIsRestoring(false);
    }
  }

  return {
    isRestoring,
    restore,
  };
}
