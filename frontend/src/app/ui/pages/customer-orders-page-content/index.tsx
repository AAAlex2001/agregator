"use client";

import { useRouter } from "next/navigation";
import { CustomerOrders } from "@/widgets/orders";

/** Подключает личные заказы к отдельной странице создания заказа. */
export function CustomerOrdersPageContent() {
  const router = useRouter();

  /** Открывает форму нового заказа. */
  function openCreateOrder() {
    router.push("/customer/orders/new");
  }

  return <CustomerOrders onCreate={openCreateOrder} />;
}
