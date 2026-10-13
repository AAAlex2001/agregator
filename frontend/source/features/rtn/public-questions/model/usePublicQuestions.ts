"use client";

import { useEffect, useState } from "react";
import { fetchPublicRtnQuestions, type PublicRtnQuestion } from "@/source/entities/rtn";

/** Вопросы на рассмотрении; null — ещё грузятся. Если загрузить не вышло, раздел просто пуст. */
export function usePublicQuestions() {
  const [questions, setQuestions] = useState<PublicRtnQuestion[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicRtnQuestions()
      .catch(() => [])
      .then((list) => {
        if (!cancelled) setQuestions(list);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return questions;
}
