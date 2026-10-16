import { API_URL } from "@/shared/config/api";

/** Адрес WebSocket-сервера, если он отличается от адреса API. */
const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

/** Строит адрес WebSocket по пути API с тем же хостом и защищённостью. */
export function getWebSocketUrl(path: string): string {
  if (WS_URL) {
    return `${WS_URL.replace(/\/$/, "")}${path}`;
  }

  if (/^https?:\/\//i.test(API_URL)) {
    return `${API_URL.replace(/^http/i, "ws")}${path}`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${window.location.host}${API_URL}${path}`;
}
