"use client";

import { useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  useUnreadCount,
  type NotificationItem,
} from "@/source/entities/notification";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { INITIAL_STATE, inboxReducer } from "./reducer";

const PAGE_SIZE = 50;
const LOAD_FAILED = "Не удалось загрузить уведомления";

/** Лента уведомлений: подгрузка, переход по уведомлению, скрытие и массовые действия. Каждое действие сразу обновляет бейдж. */
export function useNotificationsInbox() {
  const router = useRouter();
  const { showError } = useNotifications();
  const { count, setCount } = useUnreadCount();
  const [state, dispatch] = useReducer(inboxReducer, INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;
    fetchNotifications(PAGE_SIZE, 0)
      .then((data) => {
        if (cancelled) return;
        dispatch({ type: "load/success", items: data.items, hasMore: data.has_more });
        setCount(data.unread_count);
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: "load/error", error: error instanceof Error ? error.message : LOAD_FAILED });
      });
    return () => {
      cancelled = true;
    };
  }, [setCount]);

  const loadMore = async () => {
    if (state.isLoadingMore || !state.hasMore) return;
    dispatch({ type: "more/start" });
    try {
      const data = await fetchNotifications(PAGE_SIZE, state.items.length);
      dispatch({ type: "more/success", items: data.items, hasMore: data.has_more });
    } catch (error) {
      showError(error instanceof Error ? error.message : LOAD_FAILED);
    } finally {
      dispatch({ type: "more/finish" });
    }
  };

  const open = async (item: NotificationItem) => {
    if (!item.is_read) {
      dispatch({ type: "item/start", id: item.id, kind: "read" });
      try {
        const data = await markNotificationRead(item.id);
        if (data.item) dispatch({ type: "item/read", item: data.item });
        setCount(data.unread_count);
      } catch (error) {
        showError(error instanceof Error ? error.message : "Не удалось отметить уведомление");
      } finally {
        dispatch({ type: "item/finish" });
      }
    }
    if (item.action_url) router.push(item.action_url);
  };

  const dismiss = async (item: NotificationItem) => {
    dispatch({ type: "item/start", id: item.id, kind: "dismiss" });
    try {
      const data = await deleteNotification(item.id);
      dispatch({ type: "item/removed", id: item.id });
      setCount(data.unread_count);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить уведомление");
    } finally {
      dispatch({ type: "item/finish" });
    }
  };

  const markAllRead = async () => {
    dispatch({ type: "bulk/start", kind: "read" });
    try {
      const data = await markAllNotificationsRead();
      dispatch({ type: "bulk/read" });
      setCount(data.unread_count);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отметить уведомления");
    } finally {
      dispatch({ type: "bulk/finish" });
    }
  };

  const dismissAll = async () => {
    dispatch({ type: "bulk/start", kind: "dismiss" });
    try {
      await deleteAllNotifications();
      dispatch({ type: "bulk/removed" });
      setCount(0);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить уведомления");
    } finally {
      dispatch({ type: "bulk/finish" });
    }
  };

  return { state, unreadCount: count, loadMore, open, dismiss, markAllRead, dismissAll };
}
