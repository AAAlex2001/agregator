"use client";

import type { ResponseItem, ResponseViewer } from "@/entities/response";
import { Button } from "@/shared/ui/button";
import { useOpenOrderChat } from "../../model/use-open-order-chat";

/** Отклик, сторона переписки и переход в открытый чат. */
interface OpenOrderChatButtonProps {
  response: ResponseItem;
  viewer: ResponseViewer;
  onOpened: (chatUuid: string) => void;
}

/** Подписывает переход в чат по статусу отклика и стороне переписки. */
function getChatButtonText(response: ResponseItem, viewer: ResponseViewer): string {
  if (viewer === "EXPERT") {
    return "Чат с заказчиком";
  }

  if (response.status === "REVIEW") {
    return "Пригласить в чат";
  }

  if (response.status === "ACCEPTED") {
    return "Перейти в чат";
  }

  return "Чат с исполнителем";
}

/** Открывает переписку по заказу между заказчиком и исполнителем отклика. */
export function OpenOrderChatButton({
  response,
  viewer,
  onOpened,
}: OpenOrderChatButtonProps) {
  const { isOpening, openChat } = useOpenOrderChat(response, viewer, onOpened);

  return (
    <Button
      variant="secondary"
      size="sm"
      isLoading={isOpening}
      onClick={openChat}
    >
      {getChatButtonText(response, viewer)}
    </Button>
  );
}
