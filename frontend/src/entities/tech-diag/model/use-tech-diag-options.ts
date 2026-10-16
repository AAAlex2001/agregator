"use client";

import { useEffect, useState } from "react";
import { getTechDiagOptions } from "../api/get-tech-diag-options";
import type { TechDiagOptions } from "./types";

/** Виды и объекты контроля для формы вместе с состоянием их загрузки. */
interface TechDiagOptionsState {
  options: TechDiagOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает варианты НК для анкеты специалиста или лаборатории. */
export function useTechDiagOptions(isEnabled = true): TechDiagOptionsState {
  const [state, setState] = useState<TechDiagOptionsState>({
    options: { methods: [], control_objects: [] },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getTechDiagOptions()
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
                : "Не удалось загрузить виды и объекты контроля",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isEnabled]);

  return state;
}
