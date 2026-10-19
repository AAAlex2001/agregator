"use client";

import { useState } from "react";
import { refreshChannel } from "@/entities/poster-channel";
import type { PosterChannel } from "@/entities/poster-channel";
import { useNotifications } from "@/shared/ui/notifications";

/** Перечитывает у Telegram сведения о канале и права бота. */
export function useRefreshChannel(channel: PosterChannel, onRefreshed: (channel: PosterChannel) => void) {
  const { showSuccess, showError } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  /** Обновляет канал и сообщает, готов ли он к публикациям. */
  async function refresh() {
    setIsRefreshing(true);

    try {
      const refreshed = await refreshChannel(channel.id);
      onRefreshed(refreshed);
      showSuccess(refreshed.can_post ? "Канал готов к публикациям" : "Сведения обновлены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить канал");
    } finally {
      setIsRefreshing(false);
    }
  }

  return {
    isRefreshing,
    refresh,
  };
}
