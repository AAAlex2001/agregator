"use client";

import {
  hasOrderDetails,
  OrderCard,
  OrderCardSkeleton,
  OrderDetails,
  useLoadMoreOrders,
  useOrderList,
} from "@/entities/order";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Переход из публичной карточки, определяемый страницей приложения. */
interface OrderListProps {
  onOpenOrder: (orderId: number) => void;
}

/** Отображает текущую страницу заказов и добавляет следующую при прокрутке. */
export function OrderList({ onOpenOrder }: OrderListProps) {
  const { items, hasMore, operation } = useOrderList();
  const loadMoreOrders = useLoadMoreOrders();
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: operation !== "idle",
    onLoadMore: loadMoreOrders,
  });

  if (operation === "loading") {
    return (
      <ul
        className={styles.list}
        aria-hidden="true"
      >
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <OrderCardSkeleton
            key={key}
            showActions={false}
          />
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Пока нет открытых заявок"
        subtitle="Загляните позже — новые задачи появляются регулярно"
      />
    );
  }

  return (
    <>
      <ul className={styles.list}>
        {items.map((order) => (
          <li key={order.id}>
            <OrderCard
              order={order}
              onClick={() => onOpenOrder(order.id)}
              details={hasOrderDetails(order) ? <OrderDetails order={order} /> : undefined}
            />
          </li>
        ))}
      </ul>
      {operation === "loading-more" && (
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
    </>
  );
}
