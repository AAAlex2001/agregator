"use client";

import { useEffect, useState } from "react";
import { getLaboratoryProfile } from "../api/get-laboratory-profile";
import type { LaboratoryProfile } from "./types";

/** Анкета лаборатории и состояние её загрузки. */
interface LaboratoryProfileState {
  profile: LaboratoryProfile | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету лаборатории для её редактирования. */
export function useLoadLaboratoryProfile(): LaboratoryProfileState {
  const [state, setState] = useState<LaboratoryProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getLaboratoryProfile()
      .then((profile) => {
        if (isActive) {
          setState({ profile, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            profile: null,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Не удалось загрузить анкету «Лабораторные исследования»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
