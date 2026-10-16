"use client";

import { useEffect, useState } from "react";
import { getSurveyOptions } from "../api/get-survey-options";
import type { SurveyOptions } from "./types";

/** Доступные виды изысканий и области РТН со состоянием загрузки. */
interface SurveyOptionsState {
  options: SurveyOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает справочники изысканий, сохраняя их при временном отключении блока. */
export function useSurveyOptions(isEnabled = true): SurveyOptionsState {
  const [state, setState] = useState<SurveyOptionsState>({
    options: { kinds: [], rtn_areas: [] },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getSurveyOptions()
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
