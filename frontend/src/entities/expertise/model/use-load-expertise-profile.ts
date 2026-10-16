"use client";

import { useEffect, useState } from "react";
import { getExpertiseProfile } from "../api/get-expertise-profile";
import type { ExpertiseProfileValues } from "./types";

/** Анкета эксперта промышленной безопасности и состояние её загрузки. */
interface ExpertiseProfileState {
  profile: ExpertiseProfileValues | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету эксперта промышленной безопасности для её редактирования. */
export function useLoadExpertiseProfile(): ExpertiseProfileState {
  const [state, setState] = useState<ExpertiseProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getExpertiseProfile()
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
                : "Не удалось загрузить анкету «Экспертиза промышленной безопасности»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
