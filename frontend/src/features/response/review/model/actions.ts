import { fetchMyReviews } from "./api";
import type { ReviewListResponse } from "./types";

export async function loadReviews(
  onSuccess: (data: ReviewListResponse) => void,
  onError: (message: string) => void,
): Promise<void> {
  try {
    const data = await fetchMyReviews();
    onSuccess(data);
  } catch (e) {
    onError(e instanceof Error ? e.message : "Не удалось загрузить отзывы");
  }
}
