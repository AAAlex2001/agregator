"use client";

import {
  createOrder,
  getOrderDocumentsRequest,
  getOrderRequest,
  useOrderFormSubmit,
} from "@/entities/order";

/** Создаёт заказ с документами на последнем шаге формы. */
export function useCreateOrder(onSaved: () => void) {
  return useOrderFormSubmit(async (values) => {
    await createOrder(getOrderRequest(values), getOrderDocumentsRequest(values));

    return "Заказ создан";
  }, onSaved);
}