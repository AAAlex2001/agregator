import { request } from "@/shared/api/request";
import type { ReviewPage } from "../model/types";

/** Загружает страницу отзывов, полученных текущим исполнителем. */
export async function getMyReviews(skip: number): Promise<ReviewPage> {
  const response = await request(`/reviews/my?skip=${skip}&limit=50`, {
    errorMessage: "Не удалось загрузить отзывы",
  });

  return response.json();
}
