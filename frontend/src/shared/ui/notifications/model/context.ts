"use client";

import { createContext, useContext } from "react";
import type { NotificationActions } from "./types";

/** Действия показа уведомлений, которые провайдер передаёт странице. */
export const NotificationContext =createContext<NotificationActions | null>(null);

/** Возвращает действия показа уведомлений из ближайшего провайдера. */
export function useNotifications() {
  const notifications = useContext(NotificationContext);

  if (!notifications) {
    throw new Error("useNotifications используется внутри NotificationProvider");
  }

  return notifications;
}
