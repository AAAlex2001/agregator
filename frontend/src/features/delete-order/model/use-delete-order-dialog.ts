"use client";

import { useState } from "react";
import { useDeleteOrder } from "@/entities/order";
import { useNotifications } from "@/shared/ui/notifications";

/** Управляет подтверждением удаления одного заказа. */
export function useDeleteOrderDialog(orderId: number) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDeleting, removeOrder } = useDeleteOrder();
  const { showSuccess, showError } = useNotifications();

  /** Открывает подтверждение выбранного заказа. */
  function openDialog() {
    setIsOpen(true);
  }

  /** Закрывает подтверждение, если запрос ещё не отправляется. */
  function closeDialog() {
    if (!isDeleting) {
      setIsOpen(false);
    }
  }

  /** Удаляет подтверждённый заказ и оставляет окно открытым при ошибке. */
  async function confirmDeletion() {
    if (isDeleting) {
      return;
    }

    try {
      await removeOrder(orderId);
      showSuccess("Заказ удалён");
      setIsOpen(false);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось выполнить действие",
      );
    }
  }

  return {
    isOpen,
    isDeleting,
    openDialog,
    closeDialog,
    confirmDeletion,
  };
}
