"use client";

import { OrderQuestionsProvider } from "@/entities/order-question";
import { OrderQuestionsContent } from "../order-questions-content";

/** Заказ, его владелец и доступность нового вопроса исполнителю. */
interface OrderQuestionsProps {
  orderId: number;
  customerId: number;
  canAsk: boolean;
}

/** Подключает вопросы заказа и начинает новое состояние при переходе к другому заказу. */
export function OrderQuestions({
  orderId,
  customerId,
  canAsk,
}: OrderQuestionsProps) {
  return (
    <OrderQuestionsProvider
      key={orderId}
      orderId={orderId}
    >
      <OrderQuestionsContent
        customerId={customerId}
        canAsk={canAsk}
      />
    </OrderQuestionsProvider>
  );
}
