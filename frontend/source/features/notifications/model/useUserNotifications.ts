"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  deleteAllNotifications,
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notifications.api";
import { initialNotificationsState, notificationsReducer } from "./reducer";
import { useUnreadCountContext } from "./UnreadCountContext";

export function useUserNotifications(limit = 50) {
  const [state, dispatch] = useReducer(notificationsReducer, initialNotificationsState);
  const { setCount: syncBadge } = useUnreadCountContext();

  const reload = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await fetchNotifications(limit);
      dispatch({
        type: "SET_DATA",
        items: data?.items ?? [],
        hasMore: data?.has_more ?? false,
        unreadCount: data?.unread_count ?? 0,
      });
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось загрузить уведомления",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [limit]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const loadMore = useCallback(async () => {
    if (state.isLoading || state.isLoadingMore || !state.hasMore) return;
    dispatch({ type: "SET_LOADING_MORE", payload: true });
    try {
      const data = await fetchNotifications(limit, state.items.length);
      dispatch({
        type: "APPEND_ITEMS",
        items: data?.items ?? [],
        hasMore: data?.has_more ?? false,
      });
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось загрузить уведомления",
      });
    } finally {
      dispatch({ type: "SET_LOADING_MORE", payload: false });
    }
  }, [limit, state.isLoading, state.isLoadingMore, state.hasMore, state.items.length]);

  const markRead = async (notificationId: number) => {
    dispatch({ type: "SET_PENDING", id: notificationId, mode: "read" });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await markNotificationRead(notificationId);
      if (data.item) {
        dispatch({ type: "UPSERT_ITEM", payload: data.item });
      }
      dispatch({ type: "SET_UNREAD_COUNT", payload: data.unread_count });
      syncBadge(data.unread_count);
      return data.item;
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось обновить уведомление",
      });
      throw nextError;
    } finally {
      dispatch({ type: "SET_PENDING", id: null, mode: null });
    }
  };

  const dismiss = async (notificationId: number) => {
    dispatch({ type: "SET_PENDING", id: notificationId, mode: "dismiss" });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await deleteNotification(notificationId);
      dispatch({ type: "REMOVE_ITEM", payload: notificationId });
      dispatch({ type: "SET_UNREAD_COUNT", payload: data.unread_count });
      syncBadge(data.unread_count);
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось удалить уведомление",
      });
      throw nextError;
    } finally {
      dispatch({ type: "SET_PENDING", id: null, mode: null });
    }
  };

  const markAllRead = async () => {
    dispatch({ type: "SET_MARKING_ALL", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await markAllNotificationsRead();
      dispatch({ type: "MARK_ALL_READ" });
      dispatch({ type: "SET_UNREAD_COUNT", payload: data.unread_count });
      syncBadge(data.unread_count);
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось отметить уведомления как прочитанными",
      });
      throw nextError;
    } finally {
      dispatch({ type: "SET_MARKING_ALL", payload: false });
    }
  };

  const dismissAll = async () => {
    dispatch({ type: "SET_DISMISSING_ALL", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const data = await deleteAllNotifications();
      dispatch({
        type: "SET_DATA",
        items: [],
        hasMore: false,
        unreadCount: data.unread_count,
      });
      syncBadge(data.unread_count);
    } catch (nextError) {
      dispatch({
        type: "SET_ERROR",
        payload: nextError instanceof Error ? nextError.message : "Не удалось удалить уведомления",
      });
      throw nextError;
    } finally {
      dispatch({ type: "SET_DISMISSING_ALL", payload: false });
    }
  };

  return {
    ...state,
    reload,
    loadMore,
    markRead,
    dismiss,
    markAllRead,
    dismissAll,
  };
}