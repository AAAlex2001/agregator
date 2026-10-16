"use client";

import { useEffect, useState } from "react";
import { getLicenseHolders } from "../api/get-license-holders";
import type { LicenseHolderListItem } from "./types";

/** Загруженные компании и состояние одного запроса каталога. */
interface LicenseHolderListState {
  items: LicenseHolderListItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/** Загружает первые 50 компаний при открытии каталога и игнорирует ответ после закрытия. */
export function useLicenseHolders(): LicenseHolderListState {
  const [state, setState] = useState<LicenseHolderListState>({
    items: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getLicenseHolders(0, 50)
      .then((response) => {
        if (isActive) {
          setState({
            items: response.items,
            total: response.total,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            items: [],
            total: 0,
            isLoading: false,
            error: error instanceof Error ? error.message : "Ошибка загрузки",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
