"use client";

import { useEffect, useState } from "react";
import { fetchArchivedOrders } from "../api/archive.api";
import { mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import { createReview } from "@/source/features/responses/api/responses.api";

export function useArchive() {
  const { user, role } = useSession();
  const [items, setItems] = useState<OrderCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewTarget, setReviewTarget] = useState<OrderCardData | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArchivedOrders();
      setItems(data.items.map(mapApiToOrderCard));
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
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
    items, total, isLoading, error,
    reviewTarget, canLeaveReviewFor,
    openReview, closeReview, submitReview,
  };
}
