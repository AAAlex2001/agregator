"use client";

import { useEffect, useState } from "react";
import { getBlitzOrders } from "../api/get-blitz-orders";
import type { BlitzOrderScope, BlitzOrderSummary, BlitzService } from "./types";

/** Список последнего завершённого запроса и раздел, для которого он загружен. */
interface BlitzOrdersState {
  key: string | null;
  orders: BlitzOrderSummary[];
  error: string | null;
}

/** Загружает заявки сервиса по разделу: свои, входящие или взятые в работу. */
export function useBlitzOrders(scope: BlitzOrderScope, service: BlitzService) {
  const key = `${service}:${scope}`;
  const [state, setState] = useState<BlitzOrdersState>({
    key: null,
    orders: [],
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getBlitzOrders(scope, service)
      .then((orders) => {
        if (isActive) {
          setState({ key, orders, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            key,
            orders: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить заявки",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [key, scope, service]);

  const isLoading = state.key !== key;

  return {
    orders: isLoading ? [] : state.orders,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
