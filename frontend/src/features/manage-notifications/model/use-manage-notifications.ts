"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAllNotifications,
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
  useNotificationList,
  useUnreadCount,
} from "@/entities/notification";
import type { NotificationItem } from "@/entities/notification";
import { useNotifications } from "@/shared/ui/notifications";
import type { NotificationAction, PendingNotification } from "./types";

/** Открывает, удаляет и массово отмечает уведомления; каждое действие обновляет бейдж. */
export function useManageNotifications() {
  const router = useRouter();
  const list = useNotificationList();
  const { count, setCount } = useUnreadCount();
  const { showError } = useNotifications();
  const [pending, setPending] = useState<PendingNotification | null>(null);
  const [bulkAction, setBulkAction] = useState<NotificationAction | null>(null);

  /** Отмечает непрочитанное уведомление и переходит по его ссылке. */
  async function openNotification(item: NotificationItem) {
    if (!item.is_read) {
      setPending({ id: item.id, action: "read" });

      try {
        const change = await markNotificationRead(item.id);

        if (change.item) {
          list.replaceNotification(change.item);
        }

        setCount(change.unread_count);
      } catch (error) {
        showError(error instanceof Error ? error.message : "Не удалось отметить уведомление");
      } finally {
        setPending(null);
      }
    }

    if (item.action_url) {
      router.push(item.action_url);
    }
  }

  /** Удаляет одно уведомление. */
  async function dismissNotification(item: NotificationItem) {
    setPending({ id: item.id, action: "dismiss" });

    try {
      const change = await deleteNotification(item.id);

      list.removeNotification(item.id);
      setCount(change.unread_count);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить уведомление");
    } finally {
      setPending(null);
    }
  }

  /** Отмечает все уведомления прочитанными. */
  async function readAll() {
    setBulkAction("read");

    try {
      const change = await markAllNotificationsRead();

      list.markAllRead();
      setCount(change.unread_count);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отметить уведомления");
    } finally {
      setBulkAction(null);
    }
  }

  /** Удаляет все уведомления. */
  async function dismissAll() {
    setBulkAction("dismiss");

    try {
      await deleteAllNotifications();
      list.clearNotifications();
      setCount(0);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить уведомления");
    } finally {
      setBulkAction(null);
    }
  }

  return {
    pending,
    bulkAction,
    unreadCount: count,
    openNotification,
    dismissNotification,
    readAll,
    dismissAll,
  };
}
