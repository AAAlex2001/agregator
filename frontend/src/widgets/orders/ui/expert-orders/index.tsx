"use client";

import { useState } from "react";
import { isResponsesClosed, OrderListProvider } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { RespondModal } from "@/features/respond-to-order";
import { ExpertOrdersList } from "../expert-orders-list";
import { OrderQuestions } from "../order-questions";
import styles from "./style.module.scss";

/** Заказ из ссылки и переходы к откликам или подключению подписки. */
interface ExpertOrdersProps {
  openOrderId: number | null;
  onResponded: () => void;
  onSubscriptionRequired: () => void;
}

/** Лента доступных заказов исполнителя и окно отклика на выбранный заказ. */
export function ExpertOrders({
  openOrderId,
  onResponded,
  onSubscriptionRequired,
}: ExpertOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);

  /** Закрывает просмотр заказа и удаляет черновик предложения. */
  function closeOrder() {
    setSelectedOrder(null);
  }

  /** Закрывает отправленное предложение перед переходом к своим откликам. */
  function finishResponse() {
    closeOrder();
    onResponded();
  }

  /** Закрывает предложение перед переходом к выбору подписки. */
  function openSubscription() {
    closeOrder();
    onSubscriptionRequired();
  }

  return (
    <div className={styles.wrapper}>
      <OrderListProvider>
        <ExpertOrdersList
          openOrderId={openOrderId}
          onOpen={setSelectedOrder}
        />
      </OrderListProvider>

      {selectedOrder && (
        <RespondModal
          key={selectedOrder.id}
          order={selectedOrder}
          questions={
            <OrderQuestions
              orderId={selectedOrder.id}
              customerId={selectedOrder.customer_id}
              canAsk={!isResponsesClosed(selectedOrder.responses_deadline)}
            />
          }
          onClose={closeOrder}
          onResponded={finishResponse}
          onSubscriptionRequired={openSubscription}
        />
      )}
    </div>
  );
}
