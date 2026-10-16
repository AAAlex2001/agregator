"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { connectExpertRoomSocket } from "../api/connect-expert-room-socket";
import { addExpertRoomMessage } from "./messages";
import type { ExpertRoomMessage, ExpertRoomSocket, ExpertRoomTypingEntry } from "./types";

/** Сколько показывать «печатает…» после последнего сигнала коллеги. */
const TYPING_TTL_MS = 3000;

/** Не чаще одного сигнала о наборе текста за это время. */
const TYPING_SEND_INTERVAL_MS = 1500;

/**
 * Держит WebSocket чата исполнителей: новые сообщения встают в конец, сигналы
 * набора текста коллег показываются три секунды. Возвращает блокировку от сервера.
 */
export function useExpertRoomSocket(
  isEnabled: boolean,
  currentUserId: number,
  setMessages: Dispatch<SetStateAction<ExpertRoomMessage[]>>,
) {
  const [isForbidden, setForbidden] = useState(false);
  const [typingUsers, setTypingUsers] = useState<ExpertRoomTypingEntry[]>([]);
  const socketRef = useRef<ExpertRoomSocket | null>(null);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const socket = connectExpertRoomSocket({
      onEvent: (event) => {
        if (event.event === "expert_room_message") {
          setMessages((current) => addExpertRoomMessage(current, event.data));
        }

        if (event.event === "expert_room_typing" && event.data.user_id !== currentUserId) {
          const typingUser = {
            ...event.data,
            expiresAt: Date.now() + TYPING_TTL_MS,
          };

          setTypingUsers((current) => [
            ...current.filter((user) => user.user_id !== typingUser.user_id),
            typingUser,
          ]);
        }
      },
      onForbidden: () => setForbidden(true),
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isEnabled, currentUserId, setMessages]);

  useEffect(() => {
    if (typingUsers.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      const now = Date.now();

      setTypingUsers((current) => current.filter((user) => user.expiresAt > now));
    }, 500);

    return () => window.clearInterval(timer);
  }, [typingUsers.length]);

  /** Сообщает коллегам о наборе текста не чаще раза в полторы секунды. */
  function notifyTyping() {
    const now = Date.now();

    if (now - lastTypingSentRef.current < TYPING_SEND_INTERVAL_MS) {
      return;
    }

    lastTypingSentRef.current = now;
    socketRef.current?.sendTyping();
  }

  return {
    isForbidden,
    typingUsers,
    notifyTyping,
  };
}
