"use client";

import {
  hasOrderDetails,
  OrderCard,
  OrderCardSkeleton,
  OrderDetails,
  useLoadMoreOrders,
  useNextOrderPage,
  useOrderList,
} from "@/entities/order";
import { EmptyState } from "@/shared/ui/empty-state";
import { LoadMore } from "@/shared/ui/load-more";
import styles from "./style.module.scss";

/** Переход из публичной карточки, определяемый страницей приложения. */
interface OrderListProps {
  onOpenOrder: (orderId: number) => void;
}

/** Заказы страницы и «Загрузить ещё»: ссылка для поисковиков, у людей — догрузка на месте. */
export function OrderList({ onOpenOrder }: OrderListProps) {
  const { items, hasMore, operation } = useOrderList();
  const loadMoreOrders = useLoadMoreOrders();
  const nextPage = useNextOrderPage();

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
    <div className={styles.content}>
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
      {hasMore && (
        <LoadMore
          href={nextPage ? `/orders?page=${nextPage}` : undefined}
          isLoading={operation === "loading-more"}
          onLoadMore={() => void loadMoreOrders()}
        />
      )}
    </div>
  );
}
