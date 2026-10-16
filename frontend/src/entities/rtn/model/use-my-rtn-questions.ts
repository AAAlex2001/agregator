"use client";

import { useEffect, useState } from "react";
import { getMyRtnQuestions } from "../api/get-my-rtn-questions";
import type { RtnQuestion } from "./types";

/** Свои обращения и состояние их загрузки. */
interface MyRtnQuestionsState {
  questions: RtnQuestion[];
  isLoading: boolean;
  error: string | null;
}

/** Загружает свои обращения и перечитывает их после отправки нового вопроса. */
export function useMyRtnQuestions(enabled: boolean) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<MyRtnQuestionsState>({
    questions: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isActive = true;

    getMyRtnQuestions()
      .then((questions) => {
        if (isActive) {
          setState({
            questions,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            questions: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить вопросы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [enabled, version]);

  /** Загружает обращения заново, показывая ожидание списка. */
  function reload() {
    setState({
      questions: [],
      isLoading: true,
      error: null,
    });
    setVersion((current) => current + 1);
  }

  return {
    ...state,
    reload,
  };
}
