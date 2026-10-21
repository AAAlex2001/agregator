"use client";

import { useRouter } from "next/navigation";
import { RespondToOrder } from "@/widgets/orders";

/** Заказ, который открыл исполнитель. */
interface ExpertOrderPageContentProps {
  orderId: number;
}

/** Подключает заказ к ленте, своим откликам и выбору подписки. */
export function ExpertOrderPageContent({ orderId }: ExpertOrderPageContentProps) {
  const router = useRouter();

  /** Возвращает к ленте заказов без отклика. */
  function returnToOrders() {
    router.push("/expert/orders");
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
      onCancel={returnToOrders}
      onResponded={openResponses}
      onSubscriptionRequired={openSubscription}
    />
  );
}
