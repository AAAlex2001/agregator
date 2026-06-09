"use client";

import { useEffect, useState } from "react";
import { fetchExpertReviews, fetchMyReviews } from "@/source/entities/review";
import type { ReviewItem } from "./types";

const PAGE_SIZE = 50;

async function getReviews(publicId: string | undefined, skip: number, limit: number) {
  return publicId ? fetchExpertReviews(publicId, skip, limit) : fetchMyReviews(skip, limit);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Не удалось загрузить отзывы";
}

export function useExpertReviews(publicId?: string) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [expertName, setExpertName] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getReviews(publicId, 0, PAGE_SIZE);
      setReviews(data.reviews);
      setTotalReviews(data.total_reviews);
      setAvgRating(data.avg_rating);
      setExpertName(data.expert_name ?? "");
      setHasMore(data.has_more);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const data = await getReviews(publicId, reviews.length, PAGE_SIZE);
      setReviews((prev) => [...prev, ...data.reviews]);
      setHasMore(data.has_more);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicId]);

  return {
    reviews,
    totalReviews,
    avgRating,
    expertName,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    reload: load,
    loadMore,
  };
}
