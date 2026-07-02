import type { ReactNode } from "react";
import { Spinner } from "@/shared/ui";
import { OrderCard, type Order } from "@/entites/order";
import { useOrders } from "../model/useOrders";
import s from "./orders-panel.module.scss";

interface Props {
  archived?: boolean;
  limit?: number;
  empty: ReactNode;
  onOpen?: (order: Order) => void;
}

export function OrdersPanel({ archived = false, limit = 12, empty, onOpen }: Props) {
  const { orders } = useOrders(limit, archived);

  if (orders === null) {
    return (
      <div className={s.feedLoading}>
        <Spinner />
      </div>
    );
  }
  if (orders.length === 0) return <>{empty}</>;

  return (
    <div className={s.feed}>
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} onClick={() => onOpen?.(o)} />
      ))}
    </div>
  );
}
