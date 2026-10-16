import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { LandingReview } from "../model/types";

/** Загружает опубликованные отзывы для серверного HTML публичной страницы. */
export async function getPublicReviewsOnServer(): Promise<LandingReview[]> {
  const response = await fetch(`${SERVER_API_URL}/public/reviews`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}
