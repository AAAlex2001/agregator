import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";

export interface ReviewItem {
  id: number;
  order_title: string;
  company_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewListResponse {
  reviews: ReviewItem[];
  total: number;
  avg_rating: number;
}

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
