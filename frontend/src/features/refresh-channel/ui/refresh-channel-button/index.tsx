"use client";

import type { PosterChannel } from "@/entities/poster-channel";
import { Button } from "@/shared/ui/button";
import { RefreshIcon } from "@/shared/ui/icons";
import { useRefreshChannel } from "../../model/use-refresh-channel";

/** Канал и что делать с его свежей версией. */
interface RefreshChannelButtonProps {
  channel: PosterChannel;
  onRefreshed: (channel: PosterChannel) => void;
}

/** Кнопка «Обновить»: перечитать название, участников и права бота. */
export function RefreshChannelButton({ channel, onRefreshed }: RefreshChannelButtonProps) {
  const { isRefreshing, refresh } = useRefreshChannel(channel, onRefreshed);

  return (
    <Button
      variant="outline"
      size="sm"
      isLoading={isRefreshing}
      onClick={refresh}
    >
      <RefreshIcon />
      Обновить
    </Button>
  );
}
