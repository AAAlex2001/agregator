"use client";

import { useEffect, useState } from "react";
import { getPublicRtnQuestions } from "../api/get-public-rtn-questions";
import type { PublicRtnQuestion } from "./types";

/** Загружает публичные обращения; при ошибке сохраняет прежний пустой вид раздела. */
export function usePublicRtnQuestions(): PublicRtnQuestion[] | null {
  const [questions, setQuestions] = useState<PublicRtnQuestion[] | null>(null);

  useEffect(() => {
    let isActive = true;

    getPublicRtnQuestions()
      .then((loadedQuestions) => {
        if (isActive) {
          setQuestions(loadedQuestions);
        }
      })
      .catch(() => {
        if (isActive) {
          setQuestions([]);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return questions;
}
