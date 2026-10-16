"use client";

import { useState } from "react";
import { deleteOrder } from "../api/delete-order";
import { useOrderListContext } from "./order-list-context";

/** Удаляет заказ на сервере и убирает подтверждённое удаление из списка. */
export function useDeleteOrder() {
  const { dispatch } = useOrderListContext();
  const [isDeleting, setIsDeleting] = useState(false);

  /** Сохраняет карточку в списке, если сервер отклонил удаление. */
  async function removeOrder(orderId: number): Promise<void> {
    setIsDeleting(true);

    try {
      await deleteOrder(orderId);

      dispatch({
        type: "order/removed",
        orderId,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isDeleting,
    removeOrder,
  };
}
