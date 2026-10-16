"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { connectChatSocket } from "../api/connect-chat-socket";
import { markChatMessagesRead } from "../api/mark-chat-messages-read";
import { useChatList } from "./chat-list-provider";
import { addChatMessage, markMessagesRead } from "./messages";
import type { ChatMessageData } from "./types";

/**
 * Держит WebSocket открытой переписки: новые сообщения встают в конец, входящие
 * сразу отмечаются прочитанными, список диалогов получает последнее сообщение.
 * Возвращает ошибку отметки о прочтении, чтобы показать её в переписке.
 */
export function useChatSocket(
  chatUuid: string,
  currentUserId: number,
  setMessages: Dispatch<SetStateAction<ChatMessageData[]>>,
): string | null {
  const { markChatRead, updateLastMessage } = useChatList();
  const [readError, setReadError] = useState<string | null>(null);

  useEffect(() => {
    /** Отмечает переписку прочитанной на сервере и обнуляет её счётчик в списке. */
    function readChat() {
      markChatMessagesRead(chatUuid)
        .then(() => {
          setReadError(null);
          markChatRead(chatUuid);
        })
        .catch((error) => {
          setReadError(
            error instanceof Error
              ? error.message
              : "Не удалось отметить сообщения как прочитанные",
          );
        });
    }

    /** Показывает пришедшее сообщение; чужое сразу отмечает прочитанным. */
    function receiveMessage(message: ChatMessageData) {
      setMessages((current) => addChatMessage(current, message));
      updateLastMessage(chatUuid, message, currentUserId);

      if (message.sender_id !== currentUserId) {
        readChat();
      }
    }

    return connectChatSocket(chatUuid, {
      onOpen: readChat,
      onEvent: (event) => {
        if (event.event === "chat_message") {
          receiveMessage(event.data);
        }

        if (event.event === "messages_read") {
          setMessages((current) => markMessagesRead(current, event.data.message_ids));
        }
      },
    });
  }, [chatUuid, currentUserId, setMessages, markChatRead, updateLastMessage]);

  return readError;
}
