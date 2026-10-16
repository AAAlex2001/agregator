"use client";

import { useEffect, useState } from "react";
import { getResearchOptions } from "../api/get-research-options";
import type { ResearchOptions } from "./types";

/** Научные степени, звания и отрасли вместе с состоянием загрузки справочников. */
interface ResearchOptionsState {
  options: ResearchOptions;
  isLoading: boolean;
  error: string | null;
}

/** Загружает научные степени, звания и отрасли для формы исследователя. */
export function useResearchOptions(isEnabled = true): ResearchOptionsState {
  const [state, setState] = useState<ResearchOptionsState>({
    options: {
      academic_degrees: [],
      science_branches: [],
      academic_titles: [],
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let isActive = true;

    getResearchOptions()
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
