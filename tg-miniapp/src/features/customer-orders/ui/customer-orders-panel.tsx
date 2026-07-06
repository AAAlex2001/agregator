import { type ReactNode } from "react";
import { EmptyState, Spinner } from "@/shared/ui";
import { EmptyArchiveIcon } from "@/shared/ui/icons/empty";
import { CustomerOrderCard, OrderCard, type Order } from "@/entites/order";
import { useCustomerOrders } from "../model/use-customer-orders";
import s from "./customer-orders-panel.module.scss";

interface Props {
  view: "orders" | "archive";
  refreshKey: number;
  onOpen: (order: Order) => void;
  onEdit: (order: Order) => void;
  emptyActive: ReactNode;
}

export function CustomerOrdersPanel({ view, refreshKey, onOpen, onEdit, emptyActive }: Props) {
  const { items } = useCustomerOrders(view, refreshKey);

  return (
    <div className={s.wrap}>
      {items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        view === "archive" ? (
          <EmptyState
            icon={<EmptyArchiveIcon />}
            title="Архив пуст"
            subtitle="Завершённые заказы будут храниться здесь"
          />
        ) : (
          emptyActive
        )
      ) : (
        <div className={s.list}>
          {items.map((order) =>
            view === "archive" ? (
              <OrderCard key={order.id} order={order} onClick={() => onOpen(order)} />
            ) : (
              <CustomerOrderCard key={order.id} order={order} onClick={() => onOpen(order)} onEdit={onEdit} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
