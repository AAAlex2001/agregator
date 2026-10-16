import { request } from "@/shared/api/request";
import type { ContactDealReview } from "../model/types";

/** Публикует отзыв покупателя о завершённой сделке. */
export async function createContactDealReview(
  dealId: number,
  review: ContactDealReview,
): Promise<void> {
  await request(`/contact-deals/${dealId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
    errorMessage: "Не удалось опубликовать отзыв",
  });
}
