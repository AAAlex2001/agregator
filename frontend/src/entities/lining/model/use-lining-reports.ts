"use client";

import { useEffect, useState } from "react";
import { getLiningReports } from "../api/get-lining-reports";
import type { LiningReport } from "./types";

/** История отчётов и состояние её загрузки. */
interface LiningReportsState {
  reports: LiningReport[];
  isLoading: boolean;
  error: string | null;
}

/** Загружает историю отчётов при открытии вкладки. */
export function useLiningReports(): LiningReportsState {
  const [state, setState] = useState<LiningReportsState>({
    reports: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getLiningReports()
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
