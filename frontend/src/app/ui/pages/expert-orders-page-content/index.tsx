"use client";

import { useRouter } from "next/navigation";
import { ExpertOrders } from "@/widgets/orders";

/** Заказ из ссылки, который открывается после загрузки ленты. */
interface ExpertOrdersPageContentProps {
  openOrderId: number | null;
}

/** Подключает ленту исполнителя к его откликам и выбору подписки. */
export function ExpertOrdersPageContent({ openOrderId }: ExpertOrdersPageContentProps) {
  const router = useRouter();

  /** Открывает свои отклики после отправки предложения. */
  function openResponses() {
    router.push("/responses");
  }

  /** Открывает выбор подписки, без которой отклик недоступен. */
  function openSubscription() {
    router.push("/settings?section=subscription");
  }

  return (
    <ExpertOrders
      openOrderId={openOrderId}
      onResponded={openResponses}
      onSubscriptionRequired={openSubscription}
    />
  );
}
