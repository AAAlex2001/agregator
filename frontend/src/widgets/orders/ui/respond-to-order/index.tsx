"use client";

import { isResponsesClosed, useOrder } from "@/entities/order";
import { RespondWizard } from "@/features/respond-to-order";
import { EmptyState } from "@/shared/ui/empty-state";
import { OrderPageFrame } from "../order-page-frame";

/** Заказ из адреса и переходы по результату отклика. */
interface RespondToOrderProps {
  orderId: number;
  onCancel: () => void;
  onResponded: () => void;
  onSubscriptionRequired: () => void;
}

/** Страница отклика: мастер по шагам, пока заказ принимает предложения. */
export function RespondToOrder({
  orderId,
  onCancel,
  onResponded,
  onSubscriptionRequired,
}: RespondToOrderProps) {
  const { order, error, isLoading } = useOrder(orderId);
  const orderHref = `/expert/orders/${orderId}`;

  return (
    <OrderPageFrame
      isLoading={isLoading}
      error={error}
      backHref="/expert/orders"
      backLabel="К заказам"
    >
      {order && isResponsesClosed(order.responses_deadline) && (
        <EmptyState
          title="Приём откликов закончился"
          subtitle="На этот заказ больше нельзя откликнуться"
          actionLabel="К заказу"
          actionHref={orderHref}
        />
      )}
      {order && !isResponsesClosed(order.responses_deadline) && (
        <RespondWizard
          order={order}
          onCancel={onCancel}
          onResponded={onResponded}
          onSubscriptionRequired={onSubscriptionRequired}
        />
      )}
    </OrderPageFrame>
  );
}
