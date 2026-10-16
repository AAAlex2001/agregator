"use client";

import { useEffect, useState } from "react";
import { getExpertSummary } from "../api/get-expert-summary";
import type { ExpertSummary } from "./types";

/** Карточка последнего завершённого запроса и исполнитель, для которого она загружена. */
interface ExpertSummaryState {
  publicId: string | null;
  expert: ExpertSummary | null;
  error: string | null;
}

/** Загружает карточку исполнителя для шапки его истории заказов. */
export function useExpertSummary(publicId: string) {
  const [state, setState] = useState<ExpertSummaryState>({
    publicId: null,
    expert: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getExpertSummary(publicId)
      .then((expert) => {
        if (isActive) {
          setState({
            publicId,
            expert,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            publicId,
            expert: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить исполнителя",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [publicId]);

  const isLoading = state.publicId !== publicId;

  return {
    expert: isLoading ? null : state.expert,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
