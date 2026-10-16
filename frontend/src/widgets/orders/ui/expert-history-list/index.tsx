"use client";

import {
  ArchivedOrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { ArchiveOrderItem } from "../archive-order-item";
import styles from "./style.module.scss";

/** Показывает выполненные заказы исполнителя и догружает их при прокрутке. */
export function ExpertHistoryList() {
  const list = useOrderList();
  const loadMoreOrders = useLoadMoreOrders();
  const sentinelRef = useInfiniteScroll({
    hasMore: list.hasMore,
    isLoading: list.operation !== "idle",
    onLoadMore: loadMoreOrders,
  });

  if (list.operation === "loading") {
    return (
      <div
        className={styles.list}
        aria-hidden="true"
      >
        <ArchivedOrderCardSkeleton />
        <ArchivedOrderCardSkeleton />
        <ArchivedOrderCardSkeleton />
      </div>
    );
  }

  if (list.error) {
    return (
      <EmptyState
        title="Не удалось загрузить заказы"
        subtitle={list.error}
      />
    );
  }

  if (list.items.length === 0) {
    return (
      <EmptyState
        title="Пока нет выполненных заказов"
        subtitle="Здесь появятся завершённые тендеры с участием исполнителя"
      />
    );
  }

  return (
    <div className={styles.list}>
      {list.items.map((order) => (
        <ArchiveOrderItem
          key={order.id}
          order={order}
          isExpertHistory
        />
      ))}
      {list.operation === "loading-more" && (
        <div className={styles.loadMore}>
          <Loader
            label=""
            size="md"
          />
        </div>
      )}
      <div
        ref={sentinelRef}
        aria-hidden="true"
      />
    </div>
  );
}
