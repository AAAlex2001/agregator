import { API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ReviewListResponse } from "../model/types";

export async function fetchMyReviews(skip = 0, limit = 50): Promise<ReviewListResponse> {
  const response = await fetchWithSession(`${API_URL}/reviews/my?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}

export async function fetchExpertReviews(publicId: string, skip = 0, limit = 50): Promise<ReviewListResponse> {
  const response = await fetchWithSession(`${API_URL}/experts/${publicId}/reviews?skip=${skip}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Не удалось загрузить отзывы");
  }

  return response.json();
}