"use client";

import {
  NotificationCard,
  NotificationCardSkeleton,
  useNotificationList,
} from "@/entities/notification";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { useManageNotifications } from "../../model/use-manage-notifications";
import styles from "./style.module.scss";

/** Лента уведомлений с кнопками «Прочитать все», «Удалить все» и догрузкой при прокрутке. */
export function NotificationFeed() {
  const list = useNotificationList();
  const actions = useManageNotifications();
  const sentinelRef = useInfiniteScroll({
    hasMore: list.hasMore && !list.moreError,
    isLoading: list.isLoading || list.isLoadingMore,
    onLoadMore: list.loadMore,
  });

  if (list.isLoading) {
    return (
      <div className={styles.list}>
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
        <NotificationCardSkeleton />
      </div>
    );
  }

  if (list.error) {
    return (
      <EmptyState
        title="Ошибка загрузки"
        subtitle={list.error}
      />
    );
  }

  if (list.items.length === 0) {
    return (
      <EmptyState
        title="Здесь пока нет уведомлений"
        subtitle="Когда появятся события — мы покажем их тут"
      />
    );
  }

  return (
    <div className={styles.feed}>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="sm"
          disabled={actions.unreadCount === 0}
          isLoading={actions.bulkAction === "read"}
          onClick={actions.readAll}
        >
          Прочитать все
        </Button>
        <Button
          variant="danger"
          size="sm"
          isLoading={actions.bulkAction === "dismiss"}
          onClick={actions.dismissAll}
        >
          Удалить все
        </Button>
      </div>

      <div className={styles.list}>
        {list.items.map((item) => {
          const action = actions.pending?.id === item.id ? actions.pending.action : null;

          return (
            <NotificationCard
              key={item.id}
              item={item}
              isOpening={action === "read"}
              isDismissing={action === "dismiss"}
              onOpen={() => actions.openNotification(item)}
              onDismiss={() => actions.dismissNotification(item)}
            />
          );
        })}
        {list.isLoadingMore && (
          <div className={styles.loadMore}>
            <Loader
              label=""
              size="md"
            />
          </div>
        )}
        {list.moreError && (
          <div className={styles.loadMore}>
            <p className={styles.error}>{list.moreError}</p>
            <Button
              variant="outlineOrange"
              size="sm"
              onClick={list.loadMore}
            >
              Повторить
            </Button>
          </div>
        )}
      </div>
      <div
        ref={sentinelRef}
        aria-hidden="true"
      />
    </div>
  );
}
