import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ReviewListResponse } from "../model/types";

export async function fetchMyReviews(): Promise<ReviewListResponse> {
  const response = await fetchWithSession(`${API_URL}/reviews/my`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}