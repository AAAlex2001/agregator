"use client";

import { fetchExpertOrdersHistory } from "@/source/entities/expert";
import { useOrderList } from "@/source/entities/order";
import { ArchivedOrderCard, ArchivedOrderCardSkeleton } from "@/source/features/orders/archive";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import s from "./ExpertHistoryList.module.scss";

const PAGE_SIZE = 20;

interface ExpertHistoryListProps {
  publicId: string;
}

/** Выполненные заказы одного исполнителя. */
export function ExpertHistoryList({ publicId }: ExpertHistoryListProps) {
  const list = useOrderList((skip) => fetchExpertOrdersHistory(publicId, skip, PAGE_SIZE));
  const sentinelRef = useInfiniteScroll({ hasMore: list.hasMore, isLoading: list.isLoading || list.isLoadingMore, onLoadMore: list.loadMore });

  if (list.isLoading) {
    return (
      <div className={s.list} aria-hidden="true">
        {[1, 2, 3].map((key) => (
          <ArchivedOrderCardSkeleton key={key} />
        ))}
      </div>
    );
  }
  if (list.error) return <EmptyState title="Не удалось загрузить заказы" subtitle={list.error} />;
  if (list.items.length === 0) {
    return <EmptyState title="Пока нет выполненных заказов" subtitle="Здесь появятся завершённые тендеры с участием исполнителя" />;
  }

  return (
    <div className={s.list}>
      {list.items.map((order) => (
        <ArchivedOrderCard key={order.id} order={order} hideExpertHistoryLink />
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
