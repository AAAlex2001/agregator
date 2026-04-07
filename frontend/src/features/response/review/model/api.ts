import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";
import type { ReviewListResponse } from "./types";

export type { ReviewItem, ReviewListResponse } from "./types";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export async function fetchMyReviews(): Promise<ReviewListResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/reviews/my`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}
