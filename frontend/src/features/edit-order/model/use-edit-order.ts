"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  getOrderDocumentsRequest,
  getOrderFormError,
  getOrderRequest,
  updateOrder,
  useOrderForm,
} from "@/entities/order";
import { useNotifications } from "@/shared/ui/notifications";

/** Сохраняет изменения заказа и выбор уведомления участников тендера. */
export function useEditOrder(orderId: number, onSaved: () => void) {
  const { values, dispatch } = useOrderForm();
  const { showError, showSuccess } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);

  /** Меняет необходимость уведомить участников после сохранения заказа. */
  function changeNotifications(isEnabled: boolean) {
    dispatch({
      type: "notifications/changed",
      isEnabled,
    });
  }

  /** Проверяет условия и сохраняет правки; при ошибке оставляет форму открытой. */
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
      await updateOrder(
        orderId,
        getOrderRequest(values),
        getOrderDocumentsRequest(values),
        values.notifyResponders,
      );

      showSuccess("Заказ обновлён");
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
    notifyResponders: values.notifyResponders,
    changeNotifications,
    submit,
  };
}
