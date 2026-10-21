"use client";

import {
  getOrderDocumentsRequest,
  getOrderRequest,
  updateOrder,
  useOrderForm,
  useOrderFormSubmit,
} from "@/entities/order";

/** Сохраняет правки заказа на последнем шаге и выбор оповещения участников тендера. */
export function useEditOrder(orderId: number, onSaved: () => void) {
  const { values, dispatch } = useOrderForm();
  const { isSaving, submit } = useOrderFormSubmit(async (draft) => {
    await updateOrder(
      orderId,
      getOrderRequest(draft),
      getOrderDocumentsRequest(draft),
      draft.notifyResponders,
    );

    return "Заказ обновлён";
  }, onSaved);

  /** Меняет необходимость уведомить участников после сохранения заказа. */
  function changeNotifications(isEnabled: boolean) {
    dispatch({ type: "notifications/changed", isEnabled });
  }

  return {
    isSaving,
    notifyResponders: values.notifyResponders,
    changeNotifications,
    submit,
  };
}