"use client";

import { Button } from "@/shared/ui/button";
import { TelegramIcon } from "@/shared/ui/icons";
import { useConnectChannel } from "../../model/use-connect-channel";

/** Кнопка «Подключить канал»: открывает бота, где выбирается канал или группа. */
export function ConnectChannelButton() {
  const { isOpening, openBot } = useConnectChannel();

  return (
    <Button
      variant="telegram"
      isLoading={isOpening}
      onClick={openBot}
    >
      <TelegramIcon />
      Подключить канал
    </Button>
  );
}
