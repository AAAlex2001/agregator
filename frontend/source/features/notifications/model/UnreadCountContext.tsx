"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchNotifications } from "@/source/entities/notification";

interface UnreadCountContextValue {
  count: number;
  setCount: (next: number) => void;
  refresh: () => Promise<void>;
}

const UnreadCountContext = createContext<UnreadCountContextValue | null>(null);

const POLL_INTERVAL_MS = 30000;

interface ProviderProps {
  children: React.ReactNode;
}

export function UnreadCountProvider({ children }: ProviderProps) {
  const [count, setCountState] = useState(0);
  const cancelledRef = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchNotifications(1);
      if (cancelledRef.current || !data) return;
      setCountState(data.unread_count ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    void refresh();
    const id = window.setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      cancelledRef.current = true;
      window.clearInterval(id);
    };
  }, [refresh]);

  const setCount = useCallback((next: number) => setCountState(Math.max(0, next)), []);

  const value = useMemo<UnreadCountContextValue>(
    () => ({ count, setCount, refresh }),
    [count, setCount, refresh],
  );

  return <UnreadCountContext.Provider value={value}>{children}</UnreadCountContext.Provider>;
}

export function useUnreadCountContext(): UnreadCountContextValue {
  const ctx = useContext(UnreadCountContext);
  if (!ctx) {
    return {
      count: 0,
      setCount: () => {},
      refresh: async () => {},
    };
  }
  return ctx;
}
