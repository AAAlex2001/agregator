"use client";

import { deleteOrder, fetchOrders, OrderCardSkeleton, ORDERS_PAGE_SIZE, useOrderList, type OrderCardData } from "@/source/entities/order";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { CustomerOrderCard } from "./CustomerOrderCard";
import s from "./CustomerOrdersList.module.scss";

interface CustomerOrdersListProps {
  onEdit: (order: OrderCardData) => void;
  onCreate: () => void;
}

/** «Мои заказы» заказчика с подгрузкой по прокрутке. */
export function CustomerOrdersList({ onEdit, onCreate }: CustomerOrdersListProps) {
  const { showSuccess } = useNotifications();
  const list = useOrderList((skip) => fetchOrders({ skip, limit: ORDERS_PAGE_SIZE }));
  const sentinelRef = useInfiniteScroll({ hasMore: list.hasMore, isLoading: list.isLoading || list.isLoadingMore, onLoadMore: list.loadMore });

  const remove = async (order: OrderCardData) => {
    await deleteOrder(order.id);
    list.remove(order.id);
    showSuccess("Заказ удалён");
  };

  if (list.isLoading) {
    return (
      <div className={s.list} aria-hidden="true">
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    );
  }
  if (list.error) return <EmptyState title="Ошибка загрузки" subtitle={list.error} />;
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
    <div className={s.list}>
      {list.items.map((order) => (
        <CustomerOrderCard key={order.id} order={order} onEdit={() => onEdit(order)} onDelete={() => remove(order)} />
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
