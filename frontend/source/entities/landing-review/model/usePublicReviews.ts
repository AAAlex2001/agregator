"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { fetchPublicReviews, type LandingReview } from "../api/landing-review.api";

export function usePublicReviews(initial?: LandingReview[]) {
  const { showError } = useNotifications();
  const [items, setItems] = useState<LandingReview[]>(initial ?? []);
  const [isLoading, setIsLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    fetchPublicReviews()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((error) => {
        if (!cancelled) showError(error instanceof Error ? error.message : "Не удалось загрузить отзывы");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, isLoading };
}
