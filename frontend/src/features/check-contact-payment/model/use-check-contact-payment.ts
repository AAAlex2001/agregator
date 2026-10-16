"use client";

import { useState } from "react";
import {
  confirmContactPayment,
  rejectContactPayment,
  useExpertContacts,
} from "@/entities/expert-contact";
import { useNotifications } from "@/shared/ui/notifications";

/** Подтверждает оплату покупателя или отклоняет чек с указанной причиной. */
export function useCheckContactPayment(dealId: number) {
  const { showDeal } = useExpertContacts();
  const { showError, showSuccess } = useNotifications();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canReject = reason.trim().length >= 3;

  /** Подтверждает оплату и открывает покупателю контакты. */
  async function confirm() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const deal = await confirmContactPayment(dealId);
      await showDeal(deal);
      showSuccess("Оплата подтверждена, контакты открыты");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подтвердить оплату");
    } finally {
      setIsSubmitting(false);
    }
  }

  /** Отклоняет чек и сообщает покупателю причину. */
  async function reject() {
    if (!canReject || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const deal = await rejectContactPayment(dealId, reason);
      await showDeal(deal);
      showSuccess("Чек отклонен");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отклонить чек");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    reason,
    canReject,
    isSubmitting,
    changeReason: setReason,
    confirm,
    reject,
  };
}
