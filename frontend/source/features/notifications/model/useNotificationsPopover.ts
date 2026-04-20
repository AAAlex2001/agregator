"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mapNotificationCard } from "./mapNotificationCard";
import { useUserNotifications } from "./useUserNotifications";

export function useNotificationsPopover(limit = 50) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useUserNotifications(limit);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const items = notifications.items.map((item) => mapNotificationCard(item));

  const openItem = async (notificationId: number) => {
    const rawItem = notifications.items.find((item) => item.id === notificationId);
    if (!rawItem) {
      return;
    }

    if (!rawItem.is_read) {
      try {
        await notifications.markRead(notificationId);
      } catch {
        // Inline error state is handled by the feature hook.
      }
    }

    if (rawItem.action_url) {
      setIsOpen(false);
      router.push(rawItem.action_url);
    }
  };

  const dismissItem = async (notificationId: number) => {
    try {
      await notifications.dismiss(notificationId);
    } catch {
      // Inline error state is handled by the feature hook.
    }
  };

  const markAllRead = async () => {
    try {
      await notifications.markAllRead();
    } catch {
      // Inline error state is handled by the feature hook.
    }
  };

  return {
    rootRef,
    isOpen,
    items,
    unreadCount: notifications.unreadCount,
    isLoading: notifications.isLoading,
    error: notifications.error,
    pendingId: notifications.pendingId,
    pendingMode: notifications.pendingMode,
    isMarkingAll: notifications.isMarkingAll,
    toggleOpen: () => setIsOpen((currentState) => !currentState),
    close: () => setIsOpen(false),
    reload: notifications.reload,
    openItem,
    dismissItem,
    markAllRead,
  };
}