"use client";

import { useEffect, useState } from "react";
import { fetchArchivedOrders } from "../api/archive.api";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { createReview } from "@/source/features/responses/api/responses.api";

const PAGE_SIZE = 50;

export function useArchive() {
  const { user, role } = useSession();
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<OrderCardData | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArchivedOrders(0, PAGE_SIZE);
      setItems(data.items.map(mapApiToOrderCard));
      setHasMore(data.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchArchivedOrders(items.length, PAGE_SIZE);
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setHasMore(data.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { void reload(); }, []);

  const canLeaveReviewFor = (card: OrderCardData) =>
    role === "CUSTOMER"
    && user !== null
    && user.id === card.customerId
    && card.acceptedResponseId !== null
    && !card.customerHasReview;

  const openReview = (card: OrderCardData) => setReviewTarget(card);
  const closeReview = () => setReviewTarget(null);

  const submitReview = async (payload: { rating: number; comment: string }) => {
    if (!reviewTarget?.acceptedResponseId) return;
    await createReview({
      response_id: reviewTarget.acceptedResponseId,
      rating: payload.rating,
      comment: payload.comment,
    });
    setReviewTarget(null);
    await reload();
  };

  return {
    items, hasMore, isLoading, isLoadingMore, error,
    reviewTarget, canLeaveReviewFor,
    openReview, closeReview, submitReview, loadMore,
  };
}
