"use client";

import { useEffect, useState } from "react";
import { getChat } from "../api/get-chat";
import { useChatList } from "./chat-list-provider";
import { addChatMessage, readIncomingMessages } from "./messages";
import type { ChatDetailData, ChatMessageData } from "./types";
import { useChatSocket } from "./use-chat-socket";

/** Открытая переписка и состояние её загрузки. */
interface ChatThreadState {
  chat: ChatDetailData | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает переписку и обновляет её сообщения через WebSocket; экран задаёт key={chatUuid}. */
export function useChatThread(chatUuid: string, currentUserId: number) {
  const { markChatRead, updateLastMessage } = useChatList();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const readError = useChatSocket(chatUuid, currentUserId, setMessages);
  const [thread, setThread] = useState<ChatThreadState>({
    chat: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getChat(chatUuid)
      .then((chat) => {
        if (isActive) {
          setThread({ chat, isLoading: false, error: null });
          setMessages(readIncomingMessages(chat.messages, currentUserId));
          markChatRead(chatUuid);
        }
      })
      .catch((error) => {
        if (isActive) {
          setThread({
            chat: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить чат",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [chatUuid, currentUserId, markChatRead]);

  /** Добавляет отправленное сообщение, если сокет ещё не доставил его. */
  function appendMessage(message: ChatMessageData) {
    setMessages((current) => addChatMessage(current, message));
    updateLastMessage(chatUuid, message, currentUserId);
  }

  /** Заменяет переписку ответом сервера после блокировки или разблокировки. */
  function replaceChat(chat: ChatDetailData) {
    setThread({ chat, isLoading: false, error: null });
    setMessages(chat.messages);
  }

  return {
    ...thread,
    messages,
    readError,
    appendMessage,
    replaceChat,
  };
}
