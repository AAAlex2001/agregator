"use client";

import { useEffect, useState } from "react";
import { fetchExpertSummary, mapExpertSummary, type ExpertSummary } from "@/source/entities/expert";

/** Имя и статистика исполнителя для шапки истории; null — ещё грузится или не нашёлся. */
export function useExpertSummary(publicId: string): ExpertSummary | null {
  const [expert, setExpert] = useState<ExpertSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchExpertSummary(publicId)
      .then((summary) => {
        if (!cancelled) setExpert(mapExpertSummary(summary));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [publicId]);

  return expert;
}
