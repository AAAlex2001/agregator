"use client";

import {
  OrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { ExpertOrderCard } from "../expert-order-card";
import styles from "./style.module.scss";

/** Переходы на страницу заказа и к отклику. */
interface ExpertOrdersListProps {
  onOpenOrder: (orderId: number) => void;
  onRespond: (orderId: number) => void;
}

/** Показывает доступные заказы и догружает ленту при прокрутке. */
export function ExpertOrdersList({ onOpenOrder, onRespond }: ExpertOrdersListProps) {
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
        <OrderCardSkeleton />
        <OrderCardSkeleton />
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
        title="Пока нет доступных заказов"
        subtitle="Загляните позже — мы пришлём новые"
      />
    );
  }

  return (
    <div className={styles.list}>
      {list.items.map((order) => (
        <ExpertOrderCard
          key={order.id}
          order={order}
          onOpen={onOpenOrder}
          onRespond={onRespond}
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
