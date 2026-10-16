"use client";

import { useEffect, useState } from "react";
import { getTechDiagHolderProfile } from "../api/get-tech-diag-holder-profile";
import { getTechDiagOptions } from "../api/get-tech-diag-options";
import type { TechDiagHolderProfile, TechDiagOptions } from "./types";

/** Анкета лаборатории НК, справочники и состояние их загрузки. */
interface TechDiagHolderProfileState {
  profile: TechDiagHolderProfile | null;
  options: TechDiagOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету лаборатории НК и справочники для её редактирования. */
export function useLoadTechDiagHolderProfile(): TechDiagHolderProfileState {
  const [state, setState] = useState<TechDiagHolderProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getTechDiagHolderProfile(), getTechDiagOptions()])
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
                : "Не удалось загрузить анкету «Лаборатория НК»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
