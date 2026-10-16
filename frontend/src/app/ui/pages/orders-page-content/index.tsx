"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OrderListPage } from "@/entities/order";
import { useUser } from "@/entities/user";
import { PublicOrders } from "@/widgets/public-orders";
import { useAuthentication } from "../../../providers/authentication";
import { forgetOrderToRespond } from "../../../session/order-to-respond";

/** Первая страница заявок, загруженная сервером. */
interface OrdersPageContentProps {
  initialPage: OrderListPage;
}

/** Подключает список заявок к регистрации и переходам в кабинет текущей роли. */
export function OrdersPageContent({ initialPage }: OrdersPageContentProps) {
  const router = useRouter();
  const { user, role, isLoading } = useUser();
  const { openRegistration } = useAuthentication();

  useEffect(() => {
    forgetOrderToRespond();
  }, []);

  /** Приглашает гостя зарегистрироваться или открывает заказ в кабинете. */
  function openOrder(orderId: number) {
    if (isLoading) {
      return;
    }

    if (!user) {
      openRegistration();
      return;
    }

    if (role === "EXPERT") {
      router.push(`/expert/orders?orderId=${orderId}`);
      return;
    }

    router.push("/customer/orders");
  }

  return (
    <PublicOrders
      initialPage={initialPage}
      onOpenOrder={openOrder}
    />
  );
}
