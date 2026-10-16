import { getWebSocketUrl } from "@/shared/api/web-socket-url";
import type { ChatSocketEvent } from "../model/types";

/** Пауза перед повторным подключением после обрыва связи. */
const RECONNECT_DELAY_MS = 3000;

/** Реакции на подключение к переписке и на её события. */
interface ChatSocketHandlers {
  onOpen: () => void;
  onEvent: (event: ChatSocketEvent) => void;
}

/** Подключается к переписке, переподключается после обрыва и возвращает отключение. */
export function connectChatSocket(
  chatUuid: string,
  handlers: ChatSocketHandlers,
): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimer = 0;
  let isClosed = false;

  /** Открывает соединение и после его обрыва планирует новое. */
  function connect() {
    socket = new WebSocket(getWebSocketUrl(`/ws/chats/${chatUuid}`));
    socket.onopen = handlers.onOpen;
    socket.onmessage = (message: MessageEvent<string>) => {
      const event: ChatSocketEvent = JSON.parse(message.data);

      handlers.onEvent(event);
    };
    socket.onclose = () => {
      if (!isClosed) {
        reconnectTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };
  }

  connect();

  return () => {
    isClosed = true;
    window.clearTimeout(reconnectTimer);
    socket?.close();
  };
}
