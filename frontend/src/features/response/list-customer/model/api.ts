import { fetchWithSessionRefresh } from "@/shared/lib/sessionAuth";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "/api";
}

export interface CreateReviewPayload {
  response_id: number;
  rating: number;
  comment: string;
}

export async function createReview(payload: CreateReviewPayload): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await fetchWithSessionRefresh(`${apiBaseUrl}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.detail || "Не удалось оставить отзыв");
  }
}
