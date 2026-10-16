"use client";

import { useEffect, useState } from "react";
import { getSurveyOptions } from "../api/get-survey-options";
import { getSurveyProfile } from "../api/get-survey-profile";
import type { SurveyOptions, SurveyProfile } from "./types";

/** Анкета изыскателя, справочники и состояние их загрузки. */
interface SurveyProfileState {
  profile: SurveyProfile | null;
  options: SurveyOptions | null;
  isLoading: boolean;
  error: string | null;
}

/** Загружает анкету изыскателя и справочники для её редактирования. */
export function useLoadSurveyProfile(): SurveyProfileState {
  const [state, setState] = useState<SurveyProfileState>({
    profile: null,
    options: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    Promise.all([getSurveyProfile(), getSurveyOptions()])
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
                : "Не удалось загрузить анкету «Инженерные изыскания»",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
