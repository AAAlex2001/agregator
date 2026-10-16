"use client";

import { useState } from "react";
import { updateResponseStatus } from "@/entities/response";
import { useNotifications } from "@/shared/ui/notifications";
import { REJECTION_REASON_MAX_LENGTH } from "../config/reason";

/** Хранит причину отказа и отклоняет отклик после подтверждения заказчика. */
export function useRejectResponse(responseId: number, onRejected: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const { showError } = useNotifications();

  /** Открывает подтверждение с пустой причиной отказа. */
  function openDialog() {
    setReason("");
    setIsOpen(true);
  }

  /** Закрывает подтверждение, если запрос ещё не отправляется. */
  function closeDialog() {
    if (!isRejecting) {
      setIsOpen(false);
    }
  }

  /** Сохраняет причину отказа в пределах допустимой длины. */
  function changeReason(value: string) {
    setReason(value.slice(0, REJECTION_REASON_MAX_LENGTH));
  }

  /** Отклоняет отклик и оставляет окно открытым при ошибке. */
  async function confirmRejection() {
    if (isRejecting) {
      return;
    }

    setIsRejecting(true);

    try {
      await updateResponseStatus(responseId, "REJECTED", reason.trim());
      setIsOpen(false);
      onRejected();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Ошибка обновления статуса");
    } finally {
      setIsRejecting(false);
    }
  }

  return {
    isOpen,
    reason,
    isRejecting,
    openDialog,
    closeDialog,
    changeReason,
    confirmRejection,
  };
}
