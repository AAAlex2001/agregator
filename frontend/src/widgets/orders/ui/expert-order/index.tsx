"use client";

import {
  isResponsesClosed,
  OrderBrief,
  OrderDocumentsGallery,
  useOrder,
} from "@/entities/order";
import { Button } from "@/shared/ui/button";
import { OrderPageFrame } from "../order-page-frame";
import { OrderQuestions } from "../order-questions";
import styles from "./style.module.scss";

/** Номер заказа из адреса страницы. */
interface ExpertOrderProps {
  orderId: number;
}

/** Страница заказа для исполнителя: условия, документы, вопросы и переход к отклику. */
export function ExpertOrder({ orderId }: ExpertOrderProps) {
  const { order, error, isLoading } = useOrder(orderId);
  const isExpired = order ? isResponsesClosed(order.responses_deadline) : true;

  return (
    <OrderPageFrame
      isLoading={isLoading}
      error={error}
      backHref="/expert/orders"
      backLabel="К заказам"
    >
      {order && (
        <article className={styles.order}>
          <OrderBrief order={order} />
          <OrderDocumentsGallery documents={order.documents} />
          <OrderQuestions
            orderId={order.id}
            customerId={order.customer_id}
            canAsk={!isExpired}
          />

          <div className={styles.actions}>
            {isExpired && (
              <span className={styles.expiredHint}>
                На заказ больше нельзя откликнуться
              </span>
            )}
            <Button
              variant="primary"
              size="field"
              fullWidth
              showArrow
              disabled={isExpired}
              href={`/expert/orders/${order.id}/respond`}
            >
              Откликнуться
            </Button>
          </div>
        </article>
      )}
    </OrderPageFrame>
  );
}
