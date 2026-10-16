"use client";

import { useState } from "react";
import { withdrawResponse } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";

/** Управляет подтверждением и отзывом предложения исполнителя. */
export function useWithdrawResponse(responseId: number, onWithdrawn: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { showError } = useNotifications();

  /** Открывает подтверждение отзыва. */
  function openDialog() {
    setIsOpen(true);
  }

  /** Закрывает подтверждение, если запрос ещё не отправляется. */
  function closeDialog() {
    if (!isWithdrawing) {
      setIsOpen(false);
    }
  }

  /** Отзывает отклик и оставляет окно открытым при ошибке. */
  async function confirmWithdrawal() {
    if (isWithdrawing) {
      return;
    }

    setIsWithdrawing(true);

    try {
      await withdrawResponse(responseId);
      setIsOpen(false);
      onWithdrawn();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отозвать отклик");
    } finally {
      setIsWithdrawing(false);
    }
  }

  return {
    isOpen,
    isWithdrawing,
    openDialog,
    closeDialog,
    confirmWithdrawal,
  };
}
