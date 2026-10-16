"use client";

import { useEffect, useState } from "react";
import { getEcologyOptions } from "../api/get-ecology-options";
import { getEcologyProfile } from "../api/get-ecology-profile";
import type { EcologyOptions, EcologyProfile } from "./types";

/** Анкета эколога, справочник видов работ и состояние их загрузки. */
interface EcologyProfileState {
  profile: EcologyProfile | null;
  options: EcologyOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету эколога и справочник видов работ для её редактирования. */
export function useLoadEcologyProfile(): EcologyProfileState {
  const [state, setState] = useState<EcologyProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getEcologyProfile(), getEcologyOptions()])
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
                : "Не удалось загрузить анкету «Экологическое сопровождение предприятий»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
