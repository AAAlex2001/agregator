"use client";

import { useState } from "react";
import { createTelegramLink } from "@/entities/poster-channel";
import { useNotifications } from "@/shared/ui/notifications";

/**
 * Открывает бота по одноразовой ссылке. Вкладка открывается сразу по нажатию,
 * иначе браузер заблокирует её как всплывающее окно, а адрес подставляется после ответа.
 */
export function useConnectChannel() {
  const { showError } = useNotifications();
  const [isOpening, setIsOpening] = useState(false);

  /** Получает ссылку и ведёт в бота. */
  async function openBot() {
    const tab = window.open("", "_blank");
    setIsOpening(true);

    try {
      const url = await createTelegramLink();

      if (tab) {
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (error) {
      tab?.close();
      showError(error instanceof Error ? error.message : "Не удалось открыть бота");
    } finally {
      setIsOpening(false);
    }
  }

  return {
    isOpening,
    openBot,
  };
}
