import { request } from "@/shared/api/request";
import type { CreateReviewRequest } from "../model/types";

/** Публикует оценку и комментарий заказчика о выполненной работе. */
export async function createReview(payload: CreateReviewRequest): Promise<void> {
  await request("/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    errorMessage: "Не удалось оставить отзыв",
  });
}
