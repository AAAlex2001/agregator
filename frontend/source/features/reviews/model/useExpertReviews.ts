"use client";

import { useEffect, useState } from "react";
import { fetchMyReviews } from "../api/reviews.api";
import type { ReviewItem } from "./types";

export function useExpertReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMyReviews();
      setReviews(data.reviews);
      setTotalReviews(data.total);
      setAvgRating(data.avg_rating);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить отзывы");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return {
    reviews,
    totalReviews,
    avgRating,
    isLoading,
    error,
    reload: load,
  };
}