"use client";

import { useEffect, useState } from "react";
import { getExpertReviews } from "../api/get-expert-reviews";
import { getMyReviews } from "../api/get-my-reviews";
import type { ReviewPage } from "./types";

/** Отзывы последнего завершённого запроса и ключ, для которого они загружены. */
interface ExpertReviewsState {
  requestKey: string | null;
  page: ReviewPage | null;
  error: string | null;
}

/** Загружает отзывы исполнителя по publicId или отзывы текущего исполнителя. */
export function useExpertReviews(publicId?: string) {
  const [state, setState] = useState<ExpertReviewsState>({
    requestKey: null,
    page: null,
    error: null,
  });
  const [loadVersion, setLoadVersion] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestKey = `${publicId ?? "my"}:${loadVersion}`;

  useEffect(() => {
    let isActive = true;
    const request = publicId ? getExpertReviews(publicId, 0) : getMyReviews(0);

    request
      .then((page) => {
        if (isActive) {
          setState({
            requestKey,
            page,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            requestKey,
            page: null,
            error: error instanceof Error ? error.message : "Не удалось загрузить отзывы",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [publicId, requestKey]);

  const isLoading = state.requestKey !== requestKey;
  const page = isLoading ? null : state.page;

  /** Загружает первую страницу заново после ошибки. */
  function reload() {
    setLoadVersion(loadVersion + 1);
  }

  /** Добавляет следующую страницу отзывов в конец списка. */
  async function loadMore() {
    if (!page || !page.has_more || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const nextPage = publicId
        ? await getExpertReviews(publicId, page.reviews.length)
        : await getMyReviews(page.reviews.length);

      setState({
        requestKey,
        page: {
          ...page,
          reviews: [...page.reviews, ...nextPage.reviews],
          has_more: nextPage.has_more,
        },
        error: null,
      });
    } catch (error) {
      setState({
        requestKey,
        page,
        error: error instanceof Error ? error.message : "Не удалось загрузить отзывы",
      });
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    page,
    error: isLoading ? null : state.error,
    isLoading,
    isLoadingMore,
    reload,
    loadMore,
  };
}
