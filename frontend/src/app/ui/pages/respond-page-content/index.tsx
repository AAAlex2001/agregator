"use client";

import { useRouter } from "next/navigation";
import { RespondToOrder } from "@/widgets/orders";

/** Заказ, на который откликается исполнитель. */
interface RespondPageContentProps {
  orderId: number;
}

/** Подключает отклик к странице заказа, своим откликам и выбору подписки. */
export function RespondPageContent({ orderId }: RespondPageContentProps) {
  const router = useRouter();

  /** Возвращает к заказу без отправки отклика. */
  function returnToOrder() {
    router.push(`/expert/orders/${orderId}`);
  }

  /** Открывает свои отклики после отправки предложения. */
  function openResponses() {
    router.push("/responses");
  }

  /** Открывает выбор подписки, без которой отклик недоступен. */
  function openSubscription() {
    router.push("/settings?section=subscription");
  }

  return (
    <RespondToOrder
      orderId={orderId}
      onCancel={returnToOrder}
      onResponded={openResponses}
      onSubscriptionRequired={openSubscription}
    />
  );
}
