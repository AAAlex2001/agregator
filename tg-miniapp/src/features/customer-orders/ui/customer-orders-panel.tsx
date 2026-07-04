import { type ReactNode } from "react";
import { Spinner } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import { CustomerOrderCard, CUSTOMER_STATUS_LABEL, type CustomerOrderStatus, type Order } from "@/entites/order";
import { useCustomerOrders } from "../model/use-customer-orders";
import s from "./customer-orders-panel.module.scss";

const TABS = (Object.keys(CUSTOMER_STATUS_LABEL) as CustomerOrderStatus[]).map((key) => ({
  key,
  label: key === "active" ? "Активные" : key === "inwork" ? "В работе" : "Архив",
}));

const EMPTY_TEXT: Record<CustomerOrderStatus, string> = {
  active: "Нет активных заказов",
  inwork: "Пока нет заказов в работе",
  archive: "Архив пуст",
};

interface Props {
  refreshKey: number;
  onOpen: (order: Order) => void;
  emptyActive: ReactNode;
}

export function CustomerOrdersPanel({ refreshKey, onOpen, emptyActive }: Props) {
  const { tab, setTab, items } = useCustomerOrders(refreshKey);

  return (
    <div className={s.wrap}>
      <Tabs tabs={TABS} active={tab} onChange={(key) => setTab(key as CustomerOrderStatus)} />

      {items === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        tab === "active" ? (
          emptyActive
        ) : (
          <p className={s.empty}>{EMPTY_TEXT[tab]}</p>
        )
      ) : (
        <div className={s.list}>
          {items.map((order) => (
            <CustomerOrderCard key={order.id} order={order} onClick={() => onOpen(order)} />
          ))}
        </div>
      )}
    </div>
  );
}
