"use client";

import { useState } from "react";
import type { BlitzOrder } from "@/entities/blitz-order";
import { useNotifications } from "@/shared/ui/notifications";

/** Запускает шаг заявки: блокирует повторное нажатие, показывает ошибку и новую версию заявки. */
export function useBlitzAction(onChange: (order: BlitzOrder) => void) {
  const [isPending, setIsPending] = useState(false);
  const { showError, showSuccess } = useNotifications();

  /** Выполняет шаг и сообщает об успехе, если задан текст. */
  async function run(action: () => Promise<BlitzOrder>, success?: string): Promise<boolean> {
    if (isPending) {
      return false;
    }

    setIsPending(true);

    try {
      onChange(await action());

      if (success) {
        showSuccess(success);
      }

      return true;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось выполнить действие");
      return false;
    } finally {
      setIsPending(false);
    }
  }

  return { isPending, run };
}
