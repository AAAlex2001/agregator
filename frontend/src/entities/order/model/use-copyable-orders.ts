"use client";

import { useEffect, useState } from "react";
import { getCopyableOrders } from "../api/get-copyable-orders";
import type { OrderListItem } from "./order-list-item";

/** Образцы последнего завершённого запроса и заказчик, для которого они загружены. */
interface CopyableOrdersState {
  customerId: number | null;
  orders: OrderListItem[];
  error: string | null;
}

/** Загружает активные и архивные заказы заказчика для создания заказа по образцу. */
export function useCopyableOrders(customerId: number) {
  const [state, setState] = useState<CopyableOrdersState>({
    customerId: null,
    orders: [],
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getCopyableOrders(customerId)
      .then((orders) => {
        if (isActive) {
          setState({
            customerId,
            orders,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            customerId,
            orders: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить заказы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [customerId]);

  const isLoading = state.customerId !== customerId;

  return {
    orders: isLoading ? [] : state.orders,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
