"use client";

import { useState } from "react";
import { OrderListProvider } from "@/entities/order";
import type { OrderListItem } from "@/entities/order";
import { LeaveReviewModal } from "@/features/leave-review";
import { ArchiveOrdersList } from "../archive-orders-list";
import styles from "./style.module.scss";

/** Архив завершённых заказов и отзыв заказчика о выбранном исполнителе. */
export function ArchiveOrders() {
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [listVersion, setListVersion] = useState(0);

  /** Закрывает форму отзыва и удаляет её черновик. */
  function closeReview() {
    setSelectedOrder(null);
  }

  /** После публикации перечитывает архив, чтобы убрать использованную кнопку отзыва. */
  function finishReview() {
    closeReview();
    setListVersion(listVersion + 1);
  }

  return (
    <div className={styles.wrapper}>
      <OrderListProvider
        key={listVersion}
        listType="archive"
      >
        <ArchiveOrdersList onLeaveReview={setSelectedOrder} />
      </OrderListProvider>

      {selectedOrder && selectedOrder.accepted_response_id !== null && (
        <LeaveReviewModal
          key={selectedOrder.accepted_response_id}
          responseId={selectedOrder.accepted_response_id}
          customerName={selectedOrder.company || selectedOrder.customer_name}
          orderTitle={selectedOrder.title}
          expertName={selectedOrder.executor_name}
          onClose={closeReview}
          onPublished={finishReview}
        />
      )}
    </div>
  );
}
