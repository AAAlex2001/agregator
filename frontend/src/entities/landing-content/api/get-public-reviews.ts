import { API_URL } from "@/shared/config/api";
import type { LandingReview } from "../model/types";

/** Загружает опубликованные отзывы для страницы внутри кабинета. */
export async function getPublicReviews(): Promise<LandingReview[]> {
  const response = await fetch(`${API_URL}/public/reviews`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}
