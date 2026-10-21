"use client";

import { useRouter } from "next/navigation";
import { ExpertOrders } from "@/widgets/orders";

/** Подключает ленту исполнителя к страницам заказа и отклика. */
export function ExpertOrdersPageContent() {
  const router = useRouter();

  /** Открывает страницу заказа. */
  function openOrder(orderId: number) {
    router.push(`/expert/orders/${orderId}`);
  }

  /** Открывает отклик на заказ. */
  function respond(orderId: number) {
    router.push(`/expert/orders/${orderId}/respond`);
  }

  return (
    <ExpertOrders
      onOpenOrder={openOrder}
      onRespond={respond}
    />
  );
}
