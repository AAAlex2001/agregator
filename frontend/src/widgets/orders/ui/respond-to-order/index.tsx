"use client";

import { isResponsesClosed, useOrder } from "@/entities/order";
import { RespondWizard } from "@/features/respond-to-order";
import { OrderPageFrame } from "../order-page-frame";
import { OrderQuestions } from "../order-questions";

/** Заказ из адреса и переходы по результату отклика. */
interface RespondToOrderProps {
  orderId: number;
  onCancel: () => void;
  onResponded: () => void;
  onSubscriptionRequired: () => void;
}

/** Страница заказа: первый шаг — сводка заявки, дальше отклик по шагам. */
export function RespondToOrder({
  orderId,
  onCancel,
  onResponded,
  onSubscriptionRequired,
}: RespondToOrderProps) {
  const { order, error, isLoading } = useOrder(orderId);

  return (
    <OrderPageFrame
      isLoading={isLoading}
      error={error}
      backHref="/expert/orders"
      backLabel="К заказам"
    >
      {order && (
        <RespondWizard
          order={order}
          questions={
            <OrderQuestions
              orderId={order.id}
              customerId={order.customer_id}
              canAsk={!isResponsesClosed(order.responses_deadline)}
            />
          }
          onCancel={onCancel}
          onResponded={onResponded}
          onSubscriptionRequired={onSubscriptionRequired}
        />
      )}
    </OrderPageFrame>
  );
}
