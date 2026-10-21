"use client";

import { useEffect, useState } from "react";
import {
  fetchBlitzCatalog,
  fetchBlitzExperts,
  type BlitzCatalog,
  type BlitzExpertOption,
} from "@/entities/blitz-order";

/** Эксперты для назначения и справочник видов договора. Ошибка загрузки — пустые списки. */
export function useExpertOptions(orderId: number) {
  const [experts, setExperts] = useState<BlitzExpertOption[]>([]);
  const [catalog, setCatalog] = useState<BlitzCatalog | null>(null);

  useEffect(() => {
    const request = new AbortController();

    fetchBlitzExperts(orderId, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setExperts(result);
      })
      .catch(() => undefined);

    fetchBlitzCatalog(request.signal)
      .then((result) => {
        if (!request.signal.aborted) setCatalog(result);
      })
      .catch(() => undefined);

    return () => request.abort();
  }, [orderId]);

  return { experts, catalog };
}
