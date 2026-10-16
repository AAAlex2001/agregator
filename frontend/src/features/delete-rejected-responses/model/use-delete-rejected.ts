"use client";

import { useState } from "react";
import { useNotifications } from "@/shared/ui/notifications";

/** Управляет подтверждением удаления одного или всех отклонённых откликов. */
export function useDeleteRejected(remove: () => Promise<void>, onDeleted: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showError } = useNotifications();

  /** Открывает подтверждение удаления. */
  function openDialog() {
    setIsOpen(true);
  }

  /** Закрывает подтверждение, если запрос ещё не отправляется. */
  function closeDialog() {
    if (!isDeleting) {
      setIsOpen(false);
    }
  }

  /** Удаляет отклики и оставляет окно открытым при ошибке. */
  async function confirmDeletion() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await remove();
      setIsOpen(false);
      onDeleted();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить отклик");
    } finally {
      setIsDeleting(false);
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
