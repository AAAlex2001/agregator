"use client";

import { useState } from "react";
import { disconnectChannel } from "@/entities/poster-channel";
import type { PosterChannel } from "@/entities/poster-channel";
import { useNotifications } from "@/shared/ui/notifications";

/** Отключает канал после подтверждения. */
export function useDisconnectChannel(channel: PosterChannel, onDisconnected: (id: number) => void) {
  const { showSuccess, showError } = useNotifications();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  /** Отключает канал; при ошибке окно подтверждения остаётся открытым. */
  async function confirmDisconnect() {
    setIsDisconnecting(true);

    try {
      await disconnectChannel(channel.id);
      setIsConfirmOpen(false);
      onDisconnected(channel.id);
      showSuccess("Канал отключён");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отключить канал");
    } finally {
      setIsDisconnecting(false);
    }
  }

  return {
    isConfirmOpen,
    isDisconnecting,
    openConfirm: () => setIsConfirmOpen(true),
    closeConfirm: () => setIsConfirmOpen(false),
    confirmDisconnect,
  };
}
