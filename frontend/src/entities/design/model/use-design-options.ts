"use client";

import { useEffect, useState } from "react";
import { getDesignOptions } from "../api/get-design-options";
import type { DesignOptions } from "./types";

/** Справочники формы проектировщика и состояние их загрузки. */
interface DesignOptionsState {
  options: DesignOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает специальности и области РТН при открытии полей проектировщика. */
export function useDesignOptions(): DesignOptionsState {
  const [state, setState] = useState<DesignOptionsState>({
    options: { specialties: [], rtn_areas: [] },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getDesignOptions()
      .then((options) => {
        if (isActive) {
          setState({ options, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            options: { specialties: [], rtn_areas: [] },
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить варианты для анкеты проектировщика",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
