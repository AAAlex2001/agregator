"use client";

import { useEffect, useState } from "react";
import { getEcologyOptions } from "../api/get-ecology-options";
import type { EcologyOptions } from "./types";

/** Доступные виды экологических работ и состояние их загрузки. */
interface EcologyOptionsState {
  options: EcologyOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает виды работ, сохраняя их при временном отключении блока эколога. */
export function useEcologyOptions(isEnabled = true): EcologyOptionsState {
  const [state, setState] = useState<EcologyOptionsState>({
    options: { work_types: [] },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getEcologyOptions()
      .then((options) => {
        if (isActive) {
          setState({
            options,
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
                : "Не удалось загрузить справочник направления",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isEnabled]);

  return state;
}
