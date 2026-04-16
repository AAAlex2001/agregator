import { useEffect, useRef } from "react";
import type { OrderWsEvent } from "../model/types";
import type { OrderApiItem } from "@/source/entities/order";

interface Params {
  onCreated: (order: OrderApiItem) => void;
  onUpdated: (order: OrderApiItem) => void;
  onRemoved: (id: number) => void;
}

function buildWsUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) return `${api.replace(/^http/, "ws")}/ws/orders`;
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/ws/orders`;
}

export function useOrdersWs({ onCreated, onUpdated, onRemoved }: Params) {
  const cb = useRef({ onCreated, onUpdated, onRemoved });
  cb.current = { onCreated, onUpdated, onRemoved };

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ws: WebSocket | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;
    let disposed = false;

    const connect = () => {
      if (disposed) return;
      ws = new WebSocket(buildWsUrl());
      ws.onopen = () => { attempt = 0; };
      ws.onmessage = (e: MessageEvent) => {
        let msg: OrderWsEvent;
        try { msg = JSON.parse(e.data as string); } catch { return; }
        if (msg.event === "order_created") cb.current.onCreated(msg.data);
        else if (msg.event === "order_updated") cb.current.onUpdated(msg.data);
        else if (msg.event === "order_removed") cb.current.onRemoved(msg.data.id);
      };
      ws.onclose = () => { ws = null; if (!disposed) { timer = setTimeout(connect, Math.min(1000 * 2 ** attempt++, 30000)); } };
      ws.onerror = () => { ws?.close(); };
    };

    connect();
    return () => { disposed = true; if (timer) clearTimeout(timer); ws?.close(); };
  }, []);
}
