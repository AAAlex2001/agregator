"use client";

import { useEffect } from "react";
import {
  OrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { ExpertOrderCard } from "../expert-order-card";
import styles from "./style.module.scss";

/** Заказ из адресной строки и открытие выбранной карточки. */
interface ExpertOrdersListProps {
  openOrderId: number | null;
  onOpen: (order: OrderListItem) => void;
}

/** Показывает доступные заказы, догружает ленту и открывает заказ из ссылки. */
export function ExpertOrdersList({
  openOrderId,
  onOpen,
}: ExpertOrdersListProps) {
  const list = useOrderList();
  const loadMoreOrders = useLoadMoreOrders();
  const sentinelRef = useInfiniteScroll({
    hasMore: list.hasMore,
    isLoading: list.operation !== "idle",
    onLoadMore: loadMoreOrders,
  });
  const requestedOrder = list.items.find((order) => order.id === openOrderId);

  useEffect(() => {
    if (requestedOrder) {
      onOpen(requestedOrder);
    }
  }, [requestedOrder, onOpen]);

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
          onOpen={onOpen}
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
