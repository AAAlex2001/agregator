"use client";

import { useEffect, useState } from "react";
import { getTechDiagOptions } from "../api/get-tech-diag-options";
import { getTechDiagProfile } from "../api/get-tech-diag-profile";
import type { TechDiagOptions, TechDiagProfile } from "./types";

/** Анкета специалиста НК, справочники и состояние их загрузки. */
interface TechDiagProfileState {
  profile: TechDiagProfile | null;
  options: TechDiagOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету специалиста НК и справочники для её редактирования. */
export function useLoadTechDiagProfile(): TechDiagProfileState {
  const [state, setState] = useState<TechDiagProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getTechDiagProfile(), getTechDiagOptions()])
      .then(([profile, options]) => {
        if (isActive) {
          setState({ profile, options, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            profile: null,
            options: null,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить анкету «Техническое диагностирование»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
