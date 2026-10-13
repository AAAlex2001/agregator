"use client";

import { NotificationCard, NotificationCardSkeleton } from "@/source/entities/notification";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Button from "@/source/shared/ui/Button";
import Loader from "@/source/shared/ui/Loader";
import { useNotificationsInbox } from "../model/useNotificationsInbox";
import s from "./NotificationsInbox.module.scss";

/** Лента уведомлений с кнопками «Прочитать все» и «Удалить все» и подгрузкой при прокрутке. */
export function NotificationsInbox() {
  const { state, unreadCount, loadMore, open, dismiss, markAllRead, dismissAll } = useNotificationsInbox();
  const sentinelRef = useInfiniteScroll({
    hasMore: state.hasMore,
    isLoading: state.isLoading || state.isLoadingMore,
    onLoadMore: loadMore,
  });

  if (state.isLoading) {
    return (
      <div className={s.list}>
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
      </div>
    );
  }

  if (state.loadError) return <EmptyState title="Ошибка загрузки" subtitle={state.loadError} />;

  if (state.items.length === 0) {
    return <EmptyState title="Здесь пока нет уведомлений" subtitle="Когда появятся события — мы покажем их тут" />;
  }

  return (
    <div className={s.inbox}>
      <div className={s.actions}>
        <Button variant="secondary" size="sm" disabled={unreadCount === 0} isLoading={state.bulk === "read"} onClick={markAllRead}>
          Прочитать все
        </Button>
        <Button variant="danger" size="sm" isLoading={state.bulk === "dismiss"} onClick={dismissAll}>
          Удалить все
        </Button>
      </div>

      <div className={s.list}>
        {state.items.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            isOpening={state.pending?.id === item.id && state.pending.kind === "read"}
            isDismissing={state.pending?.id === item.id && state.pending.kind === "dismiss"}
            onOpen={() => open(item)}
            onDismiss={() => dismiss(item)}
          />
        ))}
        {state.isLoadingMore && (
          <div className={s.loadMore}>
            <Loader label="" size="md" />
          </div>
        )}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}
