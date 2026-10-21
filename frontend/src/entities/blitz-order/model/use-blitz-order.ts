"use client";

import { useEffect, useState } from "react";
import { getBlitzOrder } from "../api/get-blitz-order";
import { postBlitzAction } from "../api/post-blitz-action";
import type { BlitzOrder } from "./types";

/** Заявка последнего завершённого запроса и номер, для которого она загружена. */
interface BlitzOrderState {
  orderId: number | null;
  order: BlitzOrder | null;
  error: string | null;
}

/** Заявка: после возврата со страницы оплаты сначала перепроверяется оплата картой. */
function loadOrder(orderId: number, afterPayment: boolean): Promise<BlitzOrder> {
  if (afterPayment) {
    return postBlitzAction(orderId, "payment/refresh", {}, "Не удалось проверить оплату");
  }

  return getBlitzOrder(orderId);
}

/** Загружает заявку и принимает её новую версию после каждого шага. */
export function useBlitzOrder(orderId: number, afterPayment: boolean) {
  const [state, setState] = useState<BlitzOrderState>({
    orderId: null,
    order: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    loadOrder(orderId, afterPayment)
      .then((order) => {
        if (isActive) {
          setState({ orderId, order, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            orderId,
            order: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить заявку",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [orderId, afterPayment]);

  /** Показывает заявку, которую вернул сервер после действия. */
  function applyOrder(order: BlitzOrder) {
    setState({ orderId: order.id, order, error: null });
  }

  const isLoading = state.orderId !== orderId;

  return {
    order: isLoading ? null : state.order,
    error: isLoading ? null : state.error,
    isLoading,
    applyOrder,
  };
}
