"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { OrderListPage } from "@/entities/order";
import { useUser } from "@/entities/user";
import { PublicOrders } from "@/widgets/public-orders";
import { useAuthentication } from "../../../providers/authentication";
import { forgetOrderToRespond } from "../../../session/order-to-respond";

/** Страница заявок, загруженная сервером, и её номер. */
interface OrdersPageContentProps {
  initialPage: OrderListPage;
  page: number;
}

/** Подключает список заявок к регистрации и переходам в кабинет текущей роли. */
export function OrdersPageContent({ initialPage, page }: OrdersPageContentProps) {
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
      router.push(`/expert/orders/${orderId}`);
      return;
    }

    router.push("/customer/orders");
  }

  return (
    <PublicOrders
      initialPage={initialPage}
      page={page}
      onOpenOrder={openOrder}
    />
  );
}
