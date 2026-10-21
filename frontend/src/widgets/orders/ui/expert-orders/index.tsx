"use client";

import { OrderListProvider } from "@/entities/order";
import { ExpertOrdersList } from "../expert-orders-list";
import styles from "./style.module.scss";

/** Переходы на страницу заказа и сразу к отклику на него. */
interface ExpertOrdersProps {
  onOpenOrder: (orderId: number) => void;
  onRespond: (orderId: number) => void;
}

/** Лента доступных заказов исполнителя. */
export function ExpertOrders({ onOpenOrder, onRespond }: ExpertOrdersProps) {
  return (
    <div className={styles.wrapper}>
      <OrderListProvider>
        <ExpertOrdersList
          onOpenOrder={onOpenOrder}
          onRespond={onRespond}
        />
      </OrderListProvider>
    </div>
  );
}
