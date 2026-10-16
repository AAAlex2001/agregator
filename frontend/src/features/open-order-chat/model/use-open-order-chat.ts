"use client";

import { useState } from "react";
import { openOrderChat } from "@/entities/chat";
import { updateResponseStatus } from "@/entities/response";
import type { ResponseItem, ResponseViewer } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";

/** Открывает чат по отклику; новый отклик заказчик сначала приглашает в переговоры. */
export function useOpenOrderChat(
  response: ResponseItem,
  viewer: ResponseViewer,
  onOpened: (chatUuid: string) => void,
) {
  const [isOpening, setIsOpening] = useState(false);
  const { showError } = useNotifications();
  const isCustomer = viewer === "CUSTOMER";

  /** Переводит новый отклик в переговоры и передаёт адрес открытого чата. */
  async function openChat() {
    if (isOpening) {
      return;
    }

    setIsOpening(true);

    try {
      if (isCustomer && response.status === "REVIEW") {
        await updateResponseStatus(response.id, "ACCEPTED");
      }

      const expertId = isCustomer ? response.expert_id : null;
      const chat = await openOrderChat(response.order_id, expertId);

      onOpened(chat.uuid);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось открыть чат");
    } finally {
      setIsOpening(false);
    }
  }

  return {
    isOpening,
    openChat,
  };
}
