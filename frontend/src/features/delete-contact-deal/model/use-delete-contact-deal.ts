"use client";

import { useState } from "react";
import {
  deleteContactDeal,
  useExpertContacts,
} from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Управляет подтверждением удаления заявки покупателя на контакты. */
export function useDeleteContactDeal(dealId: number) {
  const { refresh } = useExpertContacts();
  const { showError, showSuccess } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  /** Удаляет заявку, обновляет каталог и оставляет окно открытым при ошибке. */
  async function confirmDeletion() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteContactDeal(dealId);
      await refresh();
      showSuccess("Заявка на контакты удалена");
      setIsOpen(false);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось удалить заявку на контакты",
      );
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
