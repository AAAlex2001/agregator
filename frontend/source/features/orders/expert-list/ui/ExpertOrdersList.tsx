"use client";

import { useEffect } from "react";
import { fetchOrders, OrderCardSkeleton, ORDERS_PAGE_SIZE, useOrderList, type OrderCardData } from "@/source/entities/order";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import { ExpertOrderCard } from "./ExpertOrderCard";
import s from "./ExpertOrdersList.module.scss";

interface ExpertOrdersListProps {
  openOrderId: number | null;
  onOpen: (order: OrderCardData) => void;
}

/** Все открытые заказы для исполнителя. Заказ из адреса (?orderId=) открывается сам, как только список загружен. */
export function ExpertOrdersList({ openOrderId, onOpen }: ExpertOrdersListProps) {
  const list = useOrderList((skip) => fetchOrders({ skip, limit: ORDERS_PAGE_SIZE }));
  const sentinelRef = useInfiniteScroll({ hasMore: list.hasMore, isLoading: list.isLoading || list.isLoadingMore, onLoadMore: list.loadMore });
  const requested = list.items.find((order) => order.id === openOrderId);

  useEffect(() => {
    if (requested) onOpen(requested);
  }, [requested, onOpen]);

  if (list.isLoading) {
    return (
      <div className={s.list} aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <OrderCardSkeleton key={key} />
        ))}
      </div>
    );
  }
  if (list.error) return <EmptyState title="Ошибка загрузки" subtitle={list.error} />;
  if (list.items.length === 0) return <EmptyState title="Пока нет доступных заказов" subtitle="Загляните позже — мы пришлём новые" />;

  return (
    <div className={s.list}>
      {list.items.map((order) => (
        <ExpertOrderCard key={order.id} order={order} onOpen={() => onOpen(order)} />
      ))}
      {list.isLoadingMore && (
        <div className={s.loadMore}>
          <Loader label="" size="md" />
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}
