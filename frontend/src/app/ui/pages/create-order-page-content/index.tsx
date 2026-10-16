"use client";

import { useRouter } from "next/navigation";
import { CreateOrder } from "@/widgets/orders";

/** Возвращает заказчика к его заказам после отмены или создания заказа. */
export function CreateOrderPageContent() {
  const router = useRouter();

  /** Открывает личный список заказов. */
  function returnToOrders() {
    router.push("/customer/orders");
  }

  return <CreateOrder onReturnToOrders={returnToOrders} />;
}
