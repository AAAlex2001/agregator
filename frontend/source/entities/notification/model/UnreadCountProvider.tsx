"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchUnreadCount } from "@/source/entities/notification";

const POLL_INTERVAL_MS = 30000;

interface UnreadCountValue {
  count: number;
  setCount: (count: number) => void;
}

const UnreadCountContext = createContext<UnreadCountValue | null>(null);

interface UnreadCountProviderProps {
  children: ReactNode;
}

/** Число непрочитанных для бейджа в меню: опрашивает сервер раз в полминуты, страница уведомлений обновляет его сразу. */
export function UnreadCountProvider({ children }: UnreadCountProviderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => fetchUnreadCount().then(setCount).catch(() => undefined);
    refresh();
    const timer = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return <UnreadCountContext.Provider value={{ count, setCount }}>{children}</UnreadCountContext.Provider>;
}

/** Бейдж непрочитанных. Работает только внутри UnreadCountProvider. */
export function useUnreadCount(): UnreadCountValue {
  const value = useContext(UnreadCountContext);
  if (!value) throw new Error("useUnreadCount must be used within UnreadCountProvider");
  return value;
}
