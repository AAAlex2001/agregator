"use client";

import { useEffect, useState } from "react";
import { fetchExpertReviews, fetchMyReviews } from "../api/reviews.api";
import type { ReviewItem } from "./types";

async function getReviews(publicId?: string) {
  return publicId ? fetchExpertReviews(publicId) : fetchMyReviews();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось загрузить отзывы";
}

export function useExpertReviews(publicId?: string) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [expertName, setExpertName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getReviews(publicId);
      setReviews(data.reviews);
      setTotalReviews(data.total);
      setAvgRating(data.avg_rating);
      setExpertName(data.expert_name ?? "");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    void getReviews(publicId)
      .then((data) => {
        setReviews(data.reviews);
        setTotalReviews(data.total);
        setAvgRating(data.avg_rating);
        setExpertName(data.expert_name ?? "");
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [publicId]);

  return {
    reviews,
    totalReviews,
    avgRating,
    expertName,
    isLoading,
    error,
    reload: load,
  };
}