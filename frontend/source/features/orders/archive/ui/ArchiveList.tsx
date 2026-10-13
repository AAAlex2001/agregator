"use client";

import { fetchArchivedOrders, ORDERS_PAGE_SIZE, useOrderList, type OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import { ArchivedOrderCard } from "./ArchivedOrderCard";
import { ArchivedOrderCardSkeleton } from "./ArchivedOrderCardSkeleton";
import s from "./ArchiveList.module.scss";

interface ArchiveListProps {
  onLeaveReview: (order: OrderCardData) => void;
}

/** Завершённые заказы. Заказчик может оставить отзыв исполнителю, пока его ещё нет. */
export function ArchiveList({ onLeaveReview }: ArchiveListProps) {
  const { user, role } = useSession();
  const list = useOrderList((skip) => fetchArchivedOrders({ skip, limit: ORDERS_PAGE_SIZE }));
  const sentinelRef = useInfiniteScroll({ hasMore: list.hasMore, isLoading: list.isLoading || list.isLoadingMore, onLoadMore: list.loadMore });

  const canReview = (order: OrderCardData) =>
    role === "CUSTOMER" && user?.id === order.customerId && order.acceptedResponseId !== null && !order.customerHasReview;

  if (list.isLoading) {
    return (
      <div className={s.list} aria-hidden="true">
        {[1, 2, 3].map((key) => (
          <ArchivedOrderCardSkeleton key={key} />
        ))}
      </div>
    );
  }
  if (list.error) return <EmptyState title="Ошибка загрузки" subtitle={list.error} />;
  if (list.items.length === 0) return <EmptyState title="Архив пуст" subtitle="Здесь будут завершённые заказы" />;

  return (
    <div className={s.list}>
      {list.items.map((order) => (
        <ArchivedOrderCard key={order.id} order={order} onLeaveReview={canReview(order) ? () => onLeaveReview(order) : undefined} />
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
