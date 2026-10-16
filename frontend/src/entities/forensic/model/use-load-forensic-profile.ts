"use client";

import { useEffect, useState } from "react";
import { getForensicProfile } from "../api/get-forensic-profile";
import type { ForensicProfile } from "./types";

/** Анкета судебного эксперта и состояние её загрузки. */
interface ForensicProfileState {
  profile: ForensicProfile | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету судебного эксперта для её редактирования. */
export function useLoadForensicProfile(): ForensicProfileState {
  const [state, setState] = useState<ForensicProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getForensicProfile()
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
                : "Не удалось загрузить анкету «Судебная экспертиза»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
