"use client";

import {
  ArchivedOrderCardSkeleton,
  useLoadMoreOrders,
  useNextOrderPage,
  useOrderList,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { EmptyState } from "@/shared/ui/empty-state";
import { LoadMore } from "@/shared/ui/load-more";
import { ArchiveOrderItem } from "../archive-order-item";
import styles from "./style.module.scss";

/** Открытие формы отзыва из списка завершённых заказов. */
interface ArchiveOrdersListProps {
  onLeaveReview: (order: OrderListItem) => void;
}

/** Общий архив по страницам: «Загрузить ещё» — ссылка на следующую страницу и догрузка на месте. */
export function ArchiveOrdersList({ onLeaveReview }: ArchiveOrdersListProps) {
  const list = useOrderList();
  const loadMoreOrders = useLoadMoreOrders();
  const nextPage = useNextOrderPage();

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
      {list.hasMore && (
        <LoadMore
          href={nextPage ? `/archive?page=${nextPage}` : undefined}
          isLoading={list.operation === "loading-more"}
          onLoadMore={() => void loadMoreOrders()}
        />
      )}
    </div>
  );
}
