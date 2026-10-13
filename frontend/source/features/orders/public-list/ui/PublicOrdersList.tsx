"use client";

import { useRouter } from "next/navigation";
import {
  fetchOrders,
  hasOrderDetails,
  OrderCard,
  OrderCardSkeleton,
  OrderDetails,
  ORDERS_PAGE_SIZE,
  useOrderList,
  type OrderCardData,
  type OrdersApiList,
  type OrderSortBy,
} from "@/source/entities/order";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { EmptyState } from "@/source/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import type { SortDir } from "@/source/shared/ui/SortPills";
import s from "./PublicOrdersList.module.scss";

interface PublicOrdersListProps {
  sortBy: OrderSortBy | null;
  sortDir: SortDir | null;
  initial?: OrdersApiList;
}

/** Открытые заявки для гостя. Клик по карточке ведёт гостя к регистрации, а вошедшего — в его раздел. */
export function PublicOrdersList({ sortBy, sortDir, initial }: PublicOrdersListProps) {
  const router = useRouter();
  const { openAuth } = useAuthModal();
  const { user, role, isLoading: isSessionLoading } = useSession();
  const list = useOrderList((skip) => fetchOrders({ skip, limit: ORDERS_PAGE_SIZE, sortBy, sortDir }), initial);
  const sentinelRef = useInfiniteScroll({ hasMore: list.hasMore, isLoading: list.isLoading || list.isLoadingMore, onLoadMore: list.loadMore });

  const open = (order: OrderCardData) => {
    if (isSessionLoading) return;
    if (!user) return openAuth("register");
    if (role === "EXPERT") return router.push(`/expert/orders?orderId=${order.id}`);
    router.push("/customer/orders");
  };

  if (list.isLoading) {
    return (
      <ul className={s.list} aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <OrderCardSkeleton key={key} showActions={false} />
        ))}
      </ul>
    );
  }
  if (list.items.length === 0) {
    return <EmptyState title="Пока нет открытых заявок" subtitle="Загляните позже — новые задачи появляются регулярно" />;
  }

  return (
    <>
      <ul className={s.list}>
        {list.items.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} onClick={() => open(order)} details={hasOrderDetails(order) ? <OrderDetails order={order} /> : undefined} />
          </li>
        ))}
      </ul>
      {list.isLoadingMore && (
        <div className={s.loadMore}>
          <Loader label="" size="md" />
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" />
    </>
  );
}
