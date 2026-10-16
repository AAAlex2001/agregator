"use client";

import { useEffect, useState } from "react";
import { getLiningCatalog } from "../api/get-lining-catalog";
import type { LiningCatalog } from "./types";

/** Справочник инструмента и состояние его загрузки. */
interface LiningCatalogState {
  catalog: LiningCatalog | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает факторы, элементы крепи и критерии при открытии калькулятора. */
export function useLiningCatalog(): LiningCatalogState {
  const [state, setState] = useState<LiningCatalogState>({
    catalog: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getLiningCatalog()
      .then((catalog) => {
        if (isActive) {
          setState({
            catalog,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            catalog: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить справочник",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
