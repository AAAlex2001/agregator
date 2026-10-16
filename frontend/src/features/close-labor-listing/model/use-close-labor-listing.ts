"use client";

import { useState } from "react";
import { useChatList } from "@/entities/chat";
import { closeLaborListing } from "@/entities/labor";
import { useNotifications } from "@/shared/ui/notifications";

/** Снимает своё объявление с публикации и обновляет связанные списки. */
export function useCloseLaborListing(listingId: number, onClosed: () => void) {
  const { refresh } = useChatList();
  const { showSuccess, showError } = useNotifications();
  const [isClosing, setIsClosing] = useState(false);

  /** Закрывает объявление; при ошибке оставляет его в списке. */
  async function close() {
    setIsClosing(true);

    try {
      await closeLaborListing(listingId);
      showSuccess("Заявка закрыта");
      refresh();
      onClosed();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось закрыть заявку");
    } finally {
      setIsClosing(false);
    }
  }

  return {
    isClosing,
    close,
  };
}
