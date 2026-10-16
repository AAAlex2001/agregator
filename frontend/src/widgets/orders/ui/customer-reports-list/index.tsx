"use client";

import {
  ArchivedOrderCardSkeleton,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { CustomerReportItem } from "../customer-report-item";
import styles from "./style.module.scss";

/** Показывает отчёты по завершённым тендерам и догружает их при прокрутке. */
export function CustomerReportsList() {
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
      <div className={styles.empty}>
        <EmptyState
          title="Ошибка загрузки"
          subtitle={list.error}
        />
      </div>
    );
  }

  if (list.items.length === 0) {
    return (
      <div className={styles.empty}>
        <EmptyState
          title="Отчётов пока нет"
          subtitle="Здесь появятся отчёты по завершённым тендерам"
        />
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {list.items.map((order) => (
        <CustomerReportItem
          key={order.id}
          order={order}
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
