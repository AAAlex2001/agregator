"use client";

import { useEffect, useState } from "react";
import { getOrder } from "../api/get-order";
import type { OrderListItem } from "./order-list-item";

/** Результат загрузки конкретного заказа. */
interface OrderState {
  orderId: number | null;
  order: OrderListItem | null;
  error: string | null;
}

/** Загружает заказ по номеру и не показывает данные предыдущего адреса. */
export function useOrder(orderId: number) {
  const [state, setState] = useState<OrderState>({
    orderId: null,
    order: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getOrder(orderId)
      .then((order) => {
        if (isActive) {
          setState({
            orderId,
            order,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            orderId,
            order: null,
            error: error instanceof Error ? error.message : "Заказ не найден",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [orderId]);

  const isLoading = state.orderId !== orderId;

  return {
    order: isLoading ? null : state.order,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
