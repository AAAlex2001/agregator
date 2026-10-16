"use client";

import { useEffect, useState } from "react";
import { getExpertRoomMessages } from "../api/get-expert-room-messages";
import { addExpertRoomMessage, addOlderExpertRoomMessages } from "./messages";
import type { ExpertRoomHistoryState, ExpertRoomMessage } from "./types";
import { useExpertRoomSocket } from "./use-expert-room-socket";

/** Загружает историю чата исполнителей, догружает старые сообщения и слушает новые. */
export function useExpertRoomThread(currentUserId: number) {
  const [messages, setMessages] = useState<ExpertRoomMessage[]>([]);
  const [history, setHistory] = useState<ExpertRoomHistoryState>({
    isLoading: true,
    error: null,
    hasMore: false,
    isBanned: false,
    banReason: null,
  });
  const [isLoadingOlder, setLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState<string | null>(null);
  const socket = useExpertRoomSocket(!history.isBanned, currentUserId, setMessages);

  useEffect(() => {
    let isActive = true;

    getExpertRoomMessages(null)
      .then((page) => {
        if (isActive) {
          setMessages(page.items);
          setHistory({
            isLoading: false,
            error: null,
            hasMore: page.has_more,
            isBanned: page.banned,
            banReason: page.ban_reason,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setHistory({
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить чат",
            hasMore: false,
            isBanned: false,
            banReason: null,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  /** Догружает сообщения старше первого показанного; после ошибки больше не пробует. */
  async function loadOlder() {
    const oldest = messages[0];

    if (!oldest || isLoadingOlder) {
      return;
    }

    setLoadingOlder(true);

    try {
      const page = await getExpertRoomMessages(oldest.id);

      setMessages((current) => addOlderExpertRoomMessages(current, page.items));
      setHistory((current) => ({ ...current, hasMore: page.has_more }));
    } catch (error) {
      setHistory((current) => ({ ...current, hasMore: false }));
      setOlderError(
        error instanceof Error ? error.message : "Не удалось загрузить старые сообщения",
      );
    } finally {
      setLoadingOlder(false);
    }
  }

  /** Показывает своё отправленное сообщение, если сокет ещё не доставил его. */
  function appendMessage(message: ExpertRoomMessage) {
    setMessages((current) => addExpertRoomMessage(current, message));
  }

  return {
    ...history,
    messages,
    isLoadingOlder,
    olderError,
    isForbidden: history.isBanned || socket.isForbidden,
    typingUsers: socket.typingUsers,
    notifyTyping: socket.notifyTyping,
    loadOlder,
    appendMessage,
  };
}
