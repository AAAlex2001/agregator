"use client";

import { useRouter } from "next/navigation";
import { ExpertOrders } from "@/widgets/orders";

/** Подключает ленту исполнителя к страницам заказов. */
export function ExpertOrdersPageContent() {
  const router = useRouter();

  /** Открывает страницу заказа. */
  function openOrder(orderId: number) {
    router.push(`/expert/orders/${orderId}`);
  }

  return (
    <ExpertOrders onOpenOrder={openOrder} />
  );
}
