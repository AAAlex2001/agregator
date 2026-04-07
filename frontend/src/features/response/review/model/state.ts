import { useState } from "react";
import type { ReviewItem } from "./types";

export function useExpertReviewsState() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  return {
    reviews,
    setReviews,
    totalReviews,
    setTotalReviews,
    avgRating,
    setAvgRating,
    isLoading,
    setIsLoading,
  };
}
