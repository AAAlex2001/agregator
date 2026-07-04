import { type ReactNode } from "react";
import { EmptyState, Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { EmptyArchiveIcon, EmptyInWorkIcon } from "@/shared/ui/icons/empty";
import { CustomerOrderCard, OrderCard, type Order } from "@/entites/order";
import { useCustomerOrders, type CustomerTab } from "../model/use-customer-orders";
import s from "./customer-orders-panel.module.scss";

const TABS = [
  { key: "active", label: "Активные" },
  { key: "inwork", label: "В работе" },
];

interface Props {
  view: "orders" | "archive";
  refreshKey: number;
  onOpen: (order: Order) => void;
  emptyActive: ReactNode;
}

export function CustomerOrdersPanel({ view, refreshKey, onOpen, emptyActive }: Props) {
  const { tab, setTab, items } = useCustomerOrders(view, refreshKey);

  return (
    <div className={s.wrap}>
      {view === "orders" && <Tabs tabs={TABS} active={tab} onChange={(key) => setTab(key as CustomerTab)} />}

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
        ) : tab === "active" ? (
          emptyActive
        ) : (
          <EmptyState
            icon={<EmptyInWorkIcon />}
            title="Нет заказов в работе"
            subtitle="Примите отклик эксперта — заказ перейдёт в работу"
          />
        )
      ) : (
        <div className={s.list}>
          {items.map((order) =>
            view === "archive" ? (
              <OrderCard key={order.id} order={order} onClick={() => onOpen(order)} />
            ) : (
              <CustomerOrderCard key={order.id} order={order} onClick={() => onOpen(order)} />
            ),
          )}
        </div>
      )}
    </div>
  );
}
