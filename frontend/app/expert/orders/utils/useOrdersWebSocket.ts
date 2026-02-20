import { useEffect, useRef } from "react";
import type { OrderResponse, OrderWsEvent } from "../store/types";

interface UseOrdersWebSocketParams {
  onCreated: (order: OrderResponse) => void;
  onUpdated: (order: OrderResponse) => void;
  onRemoved: (id: number) => void;
}

function buildWsUrl(): string {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (apiBase) {
    const wsBase = apiBase.replace(/^http/, "ws");
    return `${wsBase}/ws/orders`;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/ws/orders`;
}

export function useOrdersWebSocket({
  onCreated,
  onUpdated,
  onRemoved,
}: UseOrdersWebSocketParams): void {
  const callbacksRef = useRef({ onCreated, onUpdated, onRemoved });
  callbacksRef.current = { onCreated, onUpdated, onRemoved };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let disposed = false;

    const connect = () => {
      if (disposed) {
        return;
      }

      const url = buildWsUrl();
      ws = new WebSocket(url);

      ws.onopen = () => {
        attempt = 0;
      };

      ws.onmessage = (event: MessageEvent) => {
        let parsed: OrderWsEvent;
        try {
          parsed = JSON.parse(event.data as string) as OrderWsEvent;
        } catch {
          return;
        }

        switch (parsed.event) {
          case "order_created":
            callbacksRef.current.onCreated(parsed.data);
            break;
          case "order_updated":
            callbacksRef.current.onUpdated(parsed.data);
            break;
          case "order_removed":
            callbacksRef.current.onRemoved(parsed.data.id);
            break;
        }
      };

      ws.onclose = () => {
        ws = null;
        scheduleReconnect();
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    const scheduleReconnect = () => {
      if (disposed) {
        return;
      }

      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      attempt += 1;
      reconnectTimer = setTimeout(connect, delay);
    };

    connect();

    return () => {
      disposed = true;

      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
      }

      if (ws !== null) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.close();
      }
    };
  }, []);
}
