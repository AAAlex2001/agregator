"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getNotifications } from "../api/get-notifications";
import type { NotificationItem } from "./types";
import { useUnreadCount } from "./unread-count-provider";

/** Число уведомлений в одной странице ленты. */
const PAGE_SIZE = 50;

/** Загруженные уведомления и состояние первой и следующих страниц. */
interface NotificationListState {
  items: NotificationItem[];
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isLoadingMore: boolean;
  moreError: string | null;
}

/** Лента, её догрузка и изменения после действий с уведомлениями. */
interface NotificationListValue extends NotificationListState {
  loadMore: () => Promise<void>;
  replaceNotification: (item: NotificationItem) => void;
  removeNotification: (id: number) => void;
  markAllRead: () => void;
  clearNotifications: () => void;
}

/** Содержимое страницы уведомлений. */
interface NotificationListProviderProps {
  children: ReactNode;
}

const NotificationListContext = createContext<NotificationListValue | null>(null);

/** Загружает ленту уведомлений и сверяет счётчик непрочитанных с сервером. */
export function NotificationListProvider({ children }: NotificationListProviderProps) {
  const { setCount } = useUnreadCount();
  const [state, setState] = useState<NotificationListState>({
    items: [],
    hasMore: false,
    isLoading: true,
    error: null,
    isLoadingMore: false,
    moreError: null,
  });

  useEffect(() => {
    let isActive = true;

    getNotifications(PAGE_SIZE, 0)
      .then((page) => {
        if (isActive) {
          setState({
            items: page.items,
            hasMore: page.has_more,
            isLoading: false,
            error: null,
            isLoadingMore: false,
            moreError: null,
          });
          setCount(page.unread_count);
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить уведомления",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [setCount]);

  /** Догружает следующую страницу; ошибку показывает под лентой. */
  async function loadMore() {
    if (state.isLoadingMore || !state.hasMore) {
      return;
    }

    setState((current) => ({
      ...current,
      isLoadingMore: true,
      moreError: null,
    }));

    try {
      const page = await getNotifications(PAGE_SIZE, state.items.length);

      setState((current) => ({
        ...current,
        items: [...current.items, ...page.items],
        hasMore: page.has_more,
        isLoadingMore: false,
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        isLoadingMore: false,
        moreError: error instanceof Error ? error.message : "Не удалось загрузить уведомления",
      }));
    }
  }

  /** Заменяет уведомление ответом сервера, например прочитанным. */
  function replaceNotification(item: NotificationItem) {
    setState((current) => ({
      ...current,
      items: current.items.map((currentItem) => {
        if (currentItem.id !== item.id) {
          return currentItem;
        }

        return item;
      }),
    }));
  }

  /** Убирает удалённое уведомление из ленты. */
  function removeNotification(id: number) {
    setState((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }

  /** Отмечает все показанные уведомления прочитанными. */
  function markAllRead() {
    setState((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, is_read: true })),
    }));
  }

  /** Очищает ленту после удаления всех уведомлений. */
  function clearNotifications() {
    setState((current) => ({
      ...current,
      items: [],
      hasMore: false,
    }));
  }

  return (
    <NotificationListContext.Provider
      value={{
        ...state,
        loadMore,
        replaceNotification,
        removeNotification,
        markAllRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationListContext.Provider>
  );
}

/** Возвращает ленту уведомлений из ближайшего провайдера. */
export function useNotificationList(): NotificationListValue {
  const value = useContext(NotificationListContext);

  if (!value) {
    throw new Error("Лента уведомлений доступна только внутри NotificationListProvider");
  }

  return value;
}
