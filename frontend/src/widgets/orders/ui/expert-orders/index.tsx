"use client";

import { OrderListProvider } from "@/entities/order";
import { ExpertOrdersList } from "../expert-orders-list";
import styles from "./style.module.scss";

/** Переход на страницу заказа с откликом на него. */
interface ExpertOrdersProps {
  onOpenOrder: (orderId: number) => void;
}

/** Лента доступных заказов исполнителя. */
export function ExpertOrders({ onOpenOrder }: ExpertOrdersProps) {
  return (
    <div className={styles.wrapper}>
      <OrderListProvider>
        <ExpertOrdersList onOpenOrder={onOpenOrder} />
      </OrderListProvider>
    </div>
  );
}
