"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { NotificationContext } from "./model/context";
import type { NotificationItem, NotificationTone } from "./model/types";
import { Toast } from "./ui/toast";
import styles from "./style.module.scss";

/** Часть приложения, в которой доступны сообщения об успехе и ошибках. */
interface NotificationProviderProps {
  children: ReactNode;
}

/** Показывает последнее уведомление над страницей или открытым диалогом. */
export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationItem | null>(null);
  const nextId = useRef(0);
  const notificationId = notification?.id;

  useEffect(() => {
    if (notificationId === undefined) {
      return;
    }

    const enterTimer = setTimeout(() => {
      setNotification((current) =>
        current?.id === notificationId ? { ...current, phase: "shown" } : current,
      );
    }, 10);

    const exitTimer = setTimeout(() => {
      setNotification((current) =>
        current?.id === notificationId ? { ...current, phase: "exit" } : current,
      );
    }, 4000);

    const removeTimer = setTimeout(() => {
      setNotification((current) => (current?.id === notificationId ? null : current));
    }, 4320);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [notificationId]);

  /** Заменяет текущее уведомление и запускает для него новый срок показа. */
  function showNotification(tone: NotificationTone, message: string) {
    nextId.current += 1;
    setNotification({
      id: nextId.current,
      tone,
      message,
      phase: "enter",
    });
  }

  /** Показывает подтверждение успешного действия. */
  function showSuccess(message: string) {
    showNotification("success", message);
  }

  /** Показывает пользователю сообщение об ошибке. */
  function showError(message: string) {
    showNotification("error", message);
  }

  /** Запускает плавное скрытие текущего уведомления. */
  function closeNotification() {
    setNotification((current) => (current ? { ...current, phase: "exit" } : null));
  }

  const toastHost =
    typeof document === "undefined"
      ? null
      : (document.querySelector("dialog[open]") ?? document.body);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}

      {notification &&
        toastHost &&
        createPortal(
          <div className={styles.stack}>
            <Toast
              key={notification.id}
              notification={notification}
              onClose={closeNotification}
            />
          </div>,
          toastHost,
        )}
    </NotificationContext.Provider>
  );
}

export { useNotifications } from "./model/context";
