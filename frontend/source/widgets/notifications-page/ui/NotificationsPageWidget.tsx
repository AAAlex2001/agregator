"use client";

import { useRouter } from "next/navigation";
import { NotificationCard, NotificationCardSkeleton } from "@/source/entities/notification";
import { mapNotificationCard, useUserNotifications } from "@/source/features/notifications";
import Button from "@/source/shared/ui/Button";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Loader from "@/source/shared/ui/Loader";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import s from "./NotificationsPageWidget.module.scss";

export function NotificationsPageWidget() {
  const router = useRouter();
  const notifications = useUserNotifications(50);

  const items = notifications.items.map((item) => mapNotificationCard(item));

  const sentinelRef = useInfiniteScroll({
    hasMore: notifications.hasMore,
    isLoading: notifications.isLoading || notifications.isLoadingMore,
    onLoadMore: () => void notifications.loadMore(),
  });

  const onOpen = async (id: number) => {
    const raw = notifications.items.find((item) => item.id === id);
    if (!raw) return;
    if (!raw.is_read) {
      try {
        await notifications.markRead(id);
      } catch {
        /* ignore */
      }
    }
    if (raw.action_url) {
      router.push(raw.action_url);
    }
  };

  const onDismiss = async (id: number) => {
    try {
      await notifications.dismiss(id);
    } catch {
      /* ignore */
    }
  };

  const onMarkAll = async () => {
    try {
      await notifications.markAllRead();
    } catch {
      /* ignore */
    }
  };

  const onDismissAll = async () => {
    try {
      await notifications.dismissAll();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <div className={s.titleRow}>
          <Title text="Уведомления" as="h1" className={s.pageTitle} />
          <span className={s.badge}>{notifications.unreadCount}</span>
        </div>
        <Subtitle
          text="Все события по вашим заказам и откликам"
          className={s.pageSubtitle}
        />
      </div>

      {items.length > 0 && (
        <div className={s.actions}>
          <Button
            variant="secondary"
            size="sm"
            disabled={notifications.unreadCount === 0}
            isLoading={notifications.isMarkingAll}
            onClick={onMarkAll}
          >
            Прочитать все
          </Button>
          <Button
            variant="transparent"
            size="sm"
            isLoading={notifications.isDismissingAll}
            onClick={onDismissAll}
          >
            Удалить все
          </Button>
        </div>
      )}

      <div className={s.contentArea}>
        {notifications.isLoading ? (
          <div className={s.list}>
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
            <NotificationCardSkeleton />
          </div>
        ) : notifications.error ? (
          <div className={s.empty}>
            <EmptyStateCard title="Ошибка загрузки" subtitle={notifications.error} />
          </div>
        ) : items.length === 0 ? (
          <div className={s.empty}>
            <EmptyStateCard
              title="Здесь пока нет уведомлений"
              subtitle="Когда появятся события — мы покажем их тут"
            />
          </div>
        ) : (
          <>
            <div className={s.list}>
              {items.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  isActionPending={notifications.pendingId === item.id && notifications.pendingMode === "read"}
                  isDismissPending={notifications.pendingId === item.id && notifications.pendingMode === "dismiss"}
                  onOpen={onOpen}
                  onDismiss={onDismiss}
                />
              ))}
              {notifications.isLoadingMore && (
                <div className={s.loadMore}>
                  <Loader label="" size="md" />
                </div>
              )}
            </div>
            <div ref={sentinelRef} aria-hidden="true" />
          </>
        )}
      </div>
    </div>
  );
}
