"use client";

import { useEffect, useState } from "react";
import { getResearchOptions } from "../api/get-research-options";
import { getResearchProfile } from "../api/get-research-profile";
import type { ResearchOptions, ResearchProfile } from "./types";

/** Анкета исследователя, справочники и состояние их загрузки. */
interface ResearchProfileState {
  profile: ResearchProfile | null;
  options: ResearchOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету исследователя и справочники для её редактирования. */
export function useLoadResearchProfile(): ResearchProfileState {
  const [state, setState] = useState<ResearchProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getResearchProfile(), getResearchOptions()])
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
                : "Не удалось загрузить анкету «Научно-исследовательские работы»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
