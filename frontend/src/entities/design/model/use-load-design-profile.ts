"use client";

import { useEffect, useState } from "react";
import { getDesignOptions } from "../api/get-design-options";
import { getDesignProfile } from "../api/get-design-profile";
import type { DesignOptions, DesignProfile } from "./types";

/** Анкета проектировщика, справочники и состояние их загрузки. */
interface DesignProfileState {
  profile: DesignProfile | null;
  options: DesignOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету проектировщика и справочники для её редактирования. */
export function useLoadDesignProfile(): DesignProfileState {
  const [state, setState] = useState<DesignProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getDesignProfile(), getDesignOptions()])
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
                : "Не удалось загрузить анкету «Проектирование»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
