"use client";

import { useEffect, useState } from "react";
import { fetchMyRtnQuestions, type RtnQuestion } from "@/source/entities/rtn";

/** Свои вопросы; null — ещё грузятся. Загружаются один раз — для обновления список пересоздают. */
export function useMyQuestions() {
  const [questions, setQuestions] = useState<RtnQuestion[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchMyRtnQuestions()
      .then((list) => {
        if (!cancelled) setQuestions(list);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить вопросы");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, error };
}
