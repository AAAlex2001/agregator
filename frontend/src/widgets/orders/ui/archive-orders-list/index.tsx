"use client";

import {
  ArchivedOrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { ArchiveOrderItem } from "../archive-order-item";
import styles from "./style.module.scss";

/** Открытие формы отзыва из списка завершённых заказов. */
interface ArchiveOrdersListProps {
  onLeaveReview: (order: OrderListItem) => void;
}

/** Показывает общий архив и догружает завершённые заказы при прокрутке. */
export function ArchiveOrdersList({ onLeaveReview }: ArchiveOrdersListProps) {
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
        title="Ошибка загрузки"
        subtitle={list.error}
      />
    );
  }

  if (list.items.length === 0) {
    return (
      <EmptyState
        title="Архив пуст"
        subtitle="Здесь будут завершённые заказы"
      />
    );
  }

  return (
    <div className={styles.list}>
      {list.items.map((order) => (
        <ArchiveOrderItem
          key={order.id}
          order={order}
          onLeaveReview={onLeaveReview}
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
