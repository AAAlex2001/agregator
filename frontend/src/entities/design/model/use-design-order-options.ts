"use client";

import { useEffect, useState } from "react";
import { getDesignOrderOptions } from "../api/get-design-order-options";
import type { DesignOrderOptions } from "./types";

/** Варианты условий проектирования и состояние их загрузки. */
interface DesignOrderOptionsState {
  options: DesignOrderOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает справочники выбранного направления, сохраняя их между переключениями. */
export function useDesignOrderOptions(isEnabled = true): DesignOrderOptionsState {
  const [state, setState] = useState<DesignOrderOptionsState>({
    options: {
      specialties: [],
      doc_categories: [],
      documentation_kinds: [],
      approvals: [],
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getDesignOrderOptions()
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
                : "Не удалось загрузить справочники направления",
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, [isEnabled]);

  return state;
}
