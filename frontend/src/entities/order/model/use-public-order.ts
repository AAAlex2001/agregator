"use client";

import { useEffect, useState } from "react";
import { getPublicOrder } from "../api/get-public-order";
import type { PublicOrder } from "./types";

/** Результат загрузки конкретного публичного заказа. */
interface PublicOrderState {
  publicId: string | null;
  order: PublicOrder | null;
  error: string | null;
}

/** Загружает публичный заказ и не показывает данные предыдущей ссылки. */
export function usePublicOrder(publicId: string) {
  const [state, setState] = useState<PublicOrderState>({
    publicId: null,
    order: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getPublicOrder(publicId)
      .then((order) => {
        if (isActive) {
          setState({
            publicId,
            order,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            publicId,
            order: null,
            error: error instanceof Error ? error.message : "Заказ не найден",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [publicId]);

  const isLoading = state.publicId !== publicId;

  return {
    order: isLoading ? null : state.order,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
