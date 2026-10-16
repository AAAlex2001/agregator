import { getWebSocketUrl } from "@/shared/api/web-socket-url";
import type { ExpertRoomSocket, ExpertRoomSocketEvent } from "../model/types";

/** Первая пауза перед переподключением; каждая следующая вдвое длиннее. */
const INITIAL_RECONNECT_DELAY_MS = 1000;

/** Наибольшая пауза перед переподключением. */
const MAX_RECONNECT_DELAY_MS = 30_000;

/** Сколько раз подряд пробовать переподключиться после обрыва. */
const MAX_RECONNECT_ATTEMPTS = 8;

/** Код закрытия, которым сервер сообщает о блокировке в чате. */
const FORBIDDEN_CLOSE_CODE = 4003;

/** Реакции на события чата и на блокировку пользователя. */
interface ExpertRoomSocketHandlers {
  onEvent: (event: ExpertRoomSocketEvent) => void;
  onForbidden: () => void;
}

/** Подключается к чату исполнителей и переподключается с растущей паузой после обрыва. */
export function connectExpertRoomSocket(handlers: ExpertRoomSocketHandlers): ExpertRoomSocket {
  let socket: WebSocket | null = null;
  let reconnectTimer = 0;
  let attempts = 0;
  let isClosed = false;

  /** Открывает соединение; после обрыва планирует новое, после блокировки — нет. */
  function connect() {
    socket = new WebSocket(getWebSocketUrl("/ws/expert-room"));
    socket.onopen = () => {
      attempts = 0;
    };
    socket.onmessage = (message: MessageEvent<string>) => {
      const event: ExpertRoomSocketEvent = JSON.parse(message.data);

      handlers.onEvent(event);
    };
    socket.onerror = () => {
      socket?.close();
    };
    socket.onclose = (event) => {
      if (event.code === FORBIDDEN_CLOSE_CODE) {
        handlers.onForbidden();
        return;
      }

      if (isClosed || attempts >= MAX_RECONNECT_ATTEMPTS) {
        return;
      }

      const delay = Math.min(INITIAL_RECONNECT_DELAY_MS * 2 ** attempts, MAX_RECONNECT_DELAY_MS);

      attempts += 1;
      reconnectTimer = window.setTimeout(connect, delay);
    };
  }

  /** Сообщает коллегам, что пользователь набирает текст, если соединение открыто. */
  function sendTyping() {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "typing" }));
    }
  }

  connect();

  return {
    sendTyping,
    disconnect: () => {
      isClosed = true;
      window.clearTimeout(reconnectTimer);
      socket?.close();
    },
  };
}
