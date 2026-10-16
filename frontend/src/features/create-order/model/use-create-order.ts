"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  createOrder,
  getOrderDocumentsRequest,
  getOrderFormError,
  getOrderRequest,
  useOrderForm,
} from "@/entities/order";
import { useNotifications } from "@/shared/ui/notifications";

/** Проверяет заполненный черновик и создаёт заказ с его документами. */
export function useCreateOrder(onSaved: () => void) {
  const { values } = useOrderForm();
  const { showError, showSuccess } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  /** Сохраняет новый заказ; при ошибке оставляет заполненные поля для повтора. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const errorMessage = getOrderFormError(values);

    if (errorMessage) {
      showError(errorMessage);
      return;
    }

    setIsSaving(true);

    try {
      await createOrder(
        getOrderRequest(values),
        getOrderDocumentsRequest(values),
      );

      showSuccess("Заказ создан");
      onSaved();
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить заказ",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    submit,
  };
}
