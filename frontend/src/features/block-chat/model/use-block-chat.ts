"use client";

import { useState } from "react";
import { blockChat, unblockChat, useChatList } from "@/entities/chat";
import type { ChatDetailData } from "@/entities/chat";
import { useNotifications } from "@/shared/ui/notifications";

/** Блокирует или разблокирует переписку и передаёт её новое состояние экрану. */
export function useBlockChat(
  chat: ChatDetailData,
  onChanged: (chat: ChatDetailData) => void,
) {
  const { setChatBlocked } = useChatList();
  const { showError } = useNotifications();
  const [isChanging, setIsChanging] = useState(false);

  /** Меняет блокировку на противоположную; во время запроса повторное нажатие не работает. */
  async function toggleBlock() {
    if (isChanging) {
      return;
    }

    setIsChanging(true);

    try {
      const changeBlock = chat.is_manually_blocked ? unblockChat : blockChat;
      const updatedChat = await changeBlock(chat.uuid);

      setChatBlocked(updatedChat.uuid, updatedChat.is_blocked);
      onChanged(updatedChat);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось изменить блокировку чата",
      );
    } finally {
      setIsChanging(false);
    }
  }

  return {
    isChanging,
    toggleBlock,
  };
}
