"use client";

import { useEffect, useRef } from "react";
import type {
  ExpertRoomMessageData,
  ExpertRoomTypingPayload,
} from "@/source/entities/expert-room";
import {
  createExpertRoomWebSocket,
  serializeExpertRoomTypingFrame,
} from "@/source/entities/expert-room";

interface Args {
  enabled: boolean;
  onMessage: (message: ExpertRoomMessageData) => void;
  onTyping: (payload: ExpertRoomTypingPayload) => void;
  onForbidden?: () => void;
}

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;
const MAX_RETRIES = 8;
const TYPING_OUTGOING_DEBOUNCE_MS = 1500;

export interface ExpertRoomSocketHandle {
  notifyTyping: () => void;
}

export function useExpertRoomWebSocket(args: Args): ExpertRoomSocketHandle {
  const { enabled, onMessage, onTyping, onForbidden } = args;

  const onMessageRef = useRef(onMessage);
  const onTypingRef = useRef(onTyping);
  const onForbiddenRef = useRef(onForbidden);
  const socketRef = useRef<WebSocket | null>(null);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onTypingRef.current = onTyping;
    onForbiddenRef.current = onForbidden;
  }, [onMessage, onTyping, onForbidden]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let disposed = false;
    let retries = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleReconnect() {
      if (disposed || retries >= MAX_RETRIES) {
        return;
      }
      const delay = Math.min(INITIAL_BACKOFF_MS * 2 ** retries, MAX_BACKOFF_MS);
      retries += 1;
      reconnectTimer = setTimeout(connect, delay);
    }

    function connect() {
      if (disposed) {
        return;
      }

      const socket = createExpertRoomWebSocket();
      socketRef.current = socket;

      socket.onopen = () => {
        retries = 0;
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as { event?: string; data?: unknown };

          if (payload.event === "expert_room_message" && payload.data) {
            onMessageRef.current(payload.data as ExpertRoomMessageData);
          } else if (payload.event === "expert_room_typing" && payload.data) {
            onTypingRef.current(payload.data as ExpertRoomTypingPayload);
          }
        } catch {
          // Ignore malformed frames.
        }
      };

      socket.onclose = (event) => {
        socketRef.current = null;

        if (event.code === 4003) {
          onForbiddenRef.current?.();
          return;
        }

        if (!disposed) {
          scheduleReconnect();
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [enabled]);

  function notifyTyping() {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_OUTGOING_DEBOUNCE_MS) {
      return;
    }
    lastTypingSentRef.current = now;
    try {
      socket.send(serializeExpertRoomTypingFrame());
    } catch {
      // Ignore send errors.
    }
  }

  return { notifyTyping };
}
