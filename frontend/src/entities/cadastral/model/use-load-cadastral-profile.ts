"use client";

import { useEffect, useState } from "react";
import { getCadastralProfile } from "../api/get-cadastral-profile";
import type { CadastralProfile } from "./types";

/** Анкета кадастрового инженера и состояние её загрузки. */
interface CadastralProfileState {
  profile: CadastralProfile | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету кадастрового инженера для её редактирования. */
export function useLoadCadastralProfile(): CadastralProfileState {
  const [state, setState] = useState<CadastralProfileState>({
    profile: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getCadastralProfile()
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
                : "Не удалось загрузить анкету «Кадастровые работы»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
