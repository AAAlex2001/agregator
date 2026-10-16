"use client";

import { useEffect, useState } from "react";
import { getExpertsMap } from "../api/get-experts-map";
import type { ExpertMapItem } from "./types";

/** Исполнители на карте и состояние их загрузки. */
interface ExpertsMapState {
  items: ExpertMapItem[];
  isLoading: boolean;
  error: string | null;
}

/** Загружает точки выбранного направления; null отключает карту и запрос. */
export function useExpertsMap(direction?: string | null): ExpertsMapState {
  const [state, setState] = useState<ExpertsMapState>({
    items: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (direction === null) {
      return;
    }

    let isActive = true;

    getExpertsMap(direction)
      .then((response) => {
        if (isActive) {
          setState({
            items: response.items,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState((current) => ({
            ...current,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить исполнителей на карте",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [direction]);

  if (direction === null) {
    return {
      items: [],
      isLoading: false,
      error: null,
    };
  }

  return state;
}
