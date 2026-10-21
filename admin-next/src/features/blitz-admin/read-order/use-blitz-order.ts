"use client";

import { useEffect, useState } from "react";
import { fetchBlitzOrder, type BlitzOrder } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";

/** Загружает заявку и принимает её новую версию после действия администратора. */
export function useBlitzOrder(orderId: number) {
  const [version, setVersion] = useState(0);
  const [order, setOrder] = useState<BlitzOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const request = new AbortController();

    fetchBlitzOrder(orderId, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setOrder(result);
      })
      .catch((failure) => {
        if (!request.signal.aborted) setError(errorMessage(failure, "Не удалось загрузить заявку"));
      });

    return () => request.abort();
  }, [orderId, version]);

  return {
    order,
    error,
    applyOrder: setOrder,
    reload: () => {
      setError("");
      setVersion(version + 1);
    },
  };
}
