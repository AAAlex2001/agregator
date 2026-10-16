"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { openContactDealChat } from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Открывает переписку участников сделки на странице чата. */
export function useOpenContactDealChat(dealId: number) {
  const router = useRouter();
  const { showError } = useNotifications();
  const [isOpening, setIsOpening] = useState(false);

  /** Получает чат сделки и переходит к нему. */
  async function openChat() {
    if (isOpening) {
      return;
    }

    setIsOpening(true);

    try {
      const chatUuid = await openContactDealChat(dealId);
      router.push(`/chat/${chatUuid}`);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось открыть чат");
      setIsOpening(false);
    }
  }

  return {
    isOpening,
    openChat,
  };
}
