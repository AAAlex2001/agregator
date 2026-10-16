"use client";

import { useEffect, useState } from "react";
import { getHazardReports } from "../api/get-hazard-reports";
import type { HazardReport } from "./types";

/** История отчётов и состояние её загрузки. */
interface HazardReportsState {
  reports: HazardReport[];
  isLoading: boolean;
  error: string | null;
}

/** Загружает историю отчётов при открытии вкладки. */
export function useHazardReports(): HazardReportsState {
  const [state, setState] = useState<HazardReportsState>({
    reports: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getHazardReports()
      .then((reports) => {
        if (isActive) {
          setState({
            reports,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            reports: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить отчёты",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
