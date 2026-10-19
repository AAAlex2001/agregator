"use client";

import type { PosterChannel } from "@/entities/poster-channel";
import { Button } from "@/shared/ui/button";
import { ConfirmModal } from "@/shared/ui/confirm-modal";
import { useDisconnectChannel } from "../../model/use-disconnect-channel";

/** Канал и что сделать после отключения. */
interface DisconnectChannelButtonProps {
  channel: PosterChannel;
  onDisconnected: (id: number) => void;
}

/** Кнопка «Отключить» с подтверждением. */
export function DisconnectChannelButton({ channel, onDisconnected }: DisconnectChannelButtonProps) {
  const {
    isConfirmOpen,
    isDisconnecting,
    openConfirm,
    closeConfirm,
    confirmDisconnect,
  } = useDisconnectChannel(channel, onDisconnected);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openConfirm}
      >
        Отключить
      </Button>
      <ConfirmModal
        open={isConfirmOpen}
        title="Отключить канал?"
        description={`Бот перестанет публиковать в «${channel.title}». Уже вышедшие посты останутся в канале.`}
        confirmLabel="Отключить"
        isBusy={isDisconnecting}
        onConfirm={confirmDisconnect}
        onCancel={closeConfirm}
      />
    </>
  );
}
