"use client";

import { getOrderPublicLink } from "@/entities/order";
import { useNotifications } from "@/shared/ui/notifications";

/** Копирует публичную ссылку заказа и сообщает результат пользователю. */
export function useShareOrder() {
  const { showSuccess, showError } = useNotifications();

  /** Записывает ссылку в буфер обмена после нажатия кнопки. */
  async function shareOrder(publicId: string) {
    const url = getOrderPublicLink(publicId, window.location.origin);

    try {
      await navigator.clipboard.writeText(url);
      showSuccess("Ссылка скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  }

  return shareOrder;
}
