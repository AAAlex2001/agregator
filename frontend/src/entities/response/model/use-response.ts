"use client";

import { useEffect, useState } from "react";
import { getResponse } from "../api/get-response";
import type { ResponseItem } from "./types";

/** Результат загрузки конкретного отклика. */
interface ResponseState {
  responseId: number | null;
  response: ResponseItem | null;
  error: string | null;
}

/** Загружает отклик по номеру и не показывает данные предыдущего адреса. */
export function useResponse(responseId: number) {
  const [state, setState] = useState<ResponseState>({
    responseId: null,
    response: null,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getResponse(responseId)
      .then((response) => {
        if (isActive) {
          setState({
            responseId,
            response,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            responseId,
            response: null,
            error: error instanceof Error ? error.message : "Отклик не найден",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [responseId]);

  const isLoading = state.responseId !== responseId;

  return {
    response: isLoading ? null : state.response,
    error: isLoading ? null : state.error,
    isLoading,
  };
}
