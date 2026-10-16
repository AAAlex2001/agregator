"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getUnreadNotificationCount } from "../api/get-unread-notification-count";

/** Период опроса сервера о новых уведомлениях. */
const POLL_INTERVAL_MS = 30000;

/** Счётчик непрочитанных и его обновление со страницы уведомлений. */
interface UnreadCountValue {
  count: number;
  setCount: (count: number) => void;
}

/** Роль открытого аккаунта и содержимое кабинета. */
interface UnreadCountProviderProps {
  role: string;
  children: ReactNode;
}

const UnreadCountContext = createContext<UnreadCountValue | null>(null);

/** Узнаёт число непрочитанных уведомлений при входе и раз в полминуты. */
export function UnreadCountProvider({ role, children }: UnreadCountProviderProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    /** Обновляет счётчик; при сбое бейдж скрывается до следующего опроса. */
    function refreshCount() {
      getUnreadNotificationCount()
        .then((unreadCount) => {
          if (isActive) {
            setCount(unreadCount);
          }
        })
        .catch(() => {
          if (isActive) {
            setCount(0);
          }
        });
    }

    refreshCount();
    const timer = window.setInterval(refreshCount, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      window.clearInterval(timer);
    };
  }, [role]);

  return (
    <UnreadCountContext.Provider
      value={{
        count,
        setCount,
      }}
    >
      {children}
    </UnreadCountContext.Provider>
  );
}

/** Возвращает счётчик непрочитанных уведомлений кабинета. */
export function useUnreadCount(): UnreadCountValue {
  const value = useContext(UnreadCountContext);

  if (!value) {
    throw new Error("Счётчик уведомлений доступен только внутри UnreadCountProvider");
  }

  return value;
}
