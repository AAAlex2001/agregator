"use client";

import {
  OrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { CustomerOrderCard } from "../customer-order-card";
import styles from "./style.module.scss";

/** Переходы к созданию и редактированию заказа. */
interface CustomerOrdersListProps {
  onEdit: (order: OrderListItem) => void;
  onCreate: () => void;
}

/** Показывает личные заказы и догружает карточки при прокрутке. */
export function CustomerOrdersList({
  onEdit,
  onCreate,
}: CustomerOrdersListProps) {
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
        <OrderCardSkeleton />
        <OrderCardSkeleton />
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
        title="Вы ещё не создали ни одного заказа"
        subtitle="Опубликуйте заказ, чтобы получить отклики от исполнителей по промышленной безопасности"
        actionLabel="Добавить заказ"
        onAction={onCreate}
      />
    );
  }

  return (
    <div className={styles.list}>
      {list.items.map((order) => (
        <CustomerOrderCard
          key={order.id}
          order={order}
          onEdit={onEdit}
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
