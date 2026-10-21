"use client";

import { useEffect, useState } from "react";
import { getBlitzOrders } from "../api/get-blitz-orders";
import type { BlitzOrderScope, BlitzOrderSummary } from "./types";

/** Список последнего завершённого запроса и раздел, для которого он загружен. */
interface BlitzOrdersState {
  scope: BlitzOrderScope | null;
  orders: BlitzOrderSummary[];
  error: string | null;
}

/** Загружает заявки раздела: свои, входящие или взятые в работу. */
export function useBlitzOrders(scope: BlitzOrderScope) {
  const [state, setState] = useState<BlitzOrdersState>({
    scope: null,
    orders: [],
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getBlitzOrders(scope)
      .then((orders) => {
        if (isActive) {
          setState({ scope, orders, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            scope,
            orders: [],
            error: error instanceof Error ? error.message : "Не удалось загрузить заявки",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [scope]);

  const isLoading = state.scope !== scope;

  return {
    orders: isLoading ? [] : state.orders,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
