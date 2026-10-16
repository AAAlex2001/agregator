"use client";

import { useEffect, useState } from "react";
import { getPublicReviews } from "../api/get-public-reviews";
import type { LandingReview } from "./types";

/** Список опубликованных отзывов и результат его клиентской загрузки. */
interface PublicReviewsState {
  items: LandingReview[];
  isLoading: boolean;
  error: string | null;
}

/** Загружает отзывы при открытии страницы и игнорирует ответ после её закрытия. */
export function usePublicReviews(): PublicReviewsState {
  const [state, setState] = useState<PublicReviewsState>({
    items: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getPublicReviews()
      .then((items) => {
        if (isActive) {
          setState({
            items,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            items: [],
            isLoading: false,
            error: error instanceof Error ? error.message : "Не удалось загрузить отзывы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
