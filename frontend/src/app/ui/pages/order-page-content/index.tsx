"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePublicOrder } from "@/entities/order";
import { useUser } from "@/entities/user";
import { PublicOrderPreview } from "@/widgets/public-order-preview";
import { useAuthentication } from "../../../providers/authentication";
import {
  forgetOrderToRespond,
  rememberOrderToRespond,
} from "../../../session/order-to-respond";

/** Публичный идентификатор заказа из адреса страницы. */
interface OrderPageContentProps {
  uuid: string;
}

/** Связывает публичный заказ с авторизацией и переходом к отклику исполнителя. */
export function OrderPageContent({ uuid }: OrderPageContentProps) {
  const router = useRouter();
  const { role, isLoading: isSessionLoading } = useUser();
  const { order, error, isLoading } = usePublicOrder(uuid);
  const { openLogin, openRegistration } = useAuthentication();

  useEffect(() => {
    rememberOrderToRespond(uuid);
  }, [uuid]);

  useEffect(() => {
    if (!order || role !== "EXPERT") {
      return;
    }

    forgetOrderToRespond();
    router.replace(`/expert/orders/${order.id}`);
  }, [order, role, router]);

  /** Открывает обычную регистрацию из публичного заказа. */
  function showRegistration() {
    openRegistration();
  }

  return (
    <PublicOrderPreview
      order={order}
      error={error}
      isLoading={isSessionLoading || role === "EXPERT" || isLoading}
      onOpenLogin={openLogin}
      onOpenRegister={showRegistration}
    />
  );
}
