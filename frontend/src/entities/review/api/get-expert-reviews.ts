import { request } from "@/shared/api/request";
import type { ReviewPage } from "../model/types";

/** Загружает страницу публичных отзывов исполнителя вместе с его именем. */
export async function getExpertReviews(
  publicId: string,
  skip: number,
): Promise<ReviewPage> {
  const response = await request(`/experts/${publicId}/reviews?skip=${skip}&limit=50`, {
    errorMessage: "Не удалось загрузить отзывы",
  });

  return response.json();
}
