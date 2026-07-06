import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import {
  chatSocketUrl,
  getChat,
  markChatRead,
  sendChatMessage,
  type ChatMessage,
} from "@/entites/chat";
import { initialState, reducer } from "./reducer";

const MAX_RECONNECTS = 5;
const BASE_RECONNECT_MS = 1000;
const MAX_RECONNECT_MS = 30000;

export function useChatThread(uuid: string | null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "reset" });
    if (!uuid) return;
    let active = true;

    getChat(uuid)
      .then((detail) => active && dispatch({ type: "loaded", detail }))
      .catch((e) => active && emitError(e instanceof Error ? e.message : "Не удалось открыть чат"));

    let socket: WebSocket | null = null;
    let attempts = 0;
    let timer = 0;

    const connect = () => {
      socket = new WebSocket(chatSocketUrl(uuid));
      socket.onopen = () => {
        attempts = 0;
      };
      socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as { event: string; data: ChatMessage };
          if (parsed.event !== "chat_message") return;
          dispatch({ type: "received", message: parsed.data });
          void markChatRead(uuid).catch(() => undefined);
        } catch {
          return;
        }
      };
      socket.onclose = () => {
        if (!active || attempts >= MAX_RECONNECTS) return;
        attempts += 1;
        const delay = Math.min(MAX_RECONNECT_MS, BASE_RECONNECT_MS * 2 ** attempts);
        timer = window.setTimeout(connect, delay);
      };
    };
    connect();

    return () => {
      active = false;
      window.clearTimeout(timer);
      socket?.close();
    };
  }, [uuid]);

  const canSend = (state.text.trim() !== "" || state.files.length > 0) && !state.sending;

  const send = async () => {
    if (!uuid || !canSend) return;
    dispatch({ type: "sending", value: true });
    try {
      const message = await sendChatMessage(uuid, state.text.trim(), state.files);
      dispatch({ type: "sent", message });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить сообщение");
      dispatch({ type: "sending", value: false });
    }
  };

  return { state, dispatch, canSend, send };
}
