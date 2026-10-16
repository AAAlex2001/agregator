"use client";

import { useEffect, useState } from "react";
import { getTechExpertTips } from "../api/get-tech-expert-tips";
import type { TechExpertTip } from "./types";

/** Пауза после ввода перед запросом подсказок. */
const TIPS_DELAY_MS = 250;

/** Сколько символов нужно ввести, чтобы появились подсказки. */
const MIN_QUERY_LENGTH = 2;

/** Подсказки последнего ответа и строка, для которой они получены. */
interface TechExpertTipsState {
  query: string;
  tips: TechExpertTip[];
}

/** Загружает подсказки после паузы ввода; без подсказок поиск работает как обычно. */
export function useTechExpertTips(query: string): TechExpertTip[] {
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const [state, setState] = useState<TechExpertTipsState>({
    query: "",
    tips: [],
  });

  useEffect(() => {
    if (!hasQuery) {
      return;
    }

    let isActive = true;
    const timer = window.setTimeout(() => {
      getTechExpertTips(trimmedQuery)
        .then((tips) => {
          if (isActive) {
            setState({
              query: trimmedQuery,
              tips,
            });
          }
        })
        .catch(() => {
          if (isActive) {
            setState({
              query: trimmedQuery,
              tips: [],
            });
          }
        });
    }, TIPS_DELAY_MS);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [hasQuery, trimmedQuery]);

  return hasQuery && state.query === trimmedQuery ? state.tips : [];
}
