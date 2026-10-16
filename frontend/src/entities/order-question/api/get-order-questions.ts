import { request } from "@/shared/api/request";
import type { OrderQuestionList } from "../model/types";

/** Загружает вопросы; сервер учитывает автора, заказчика и анонимность. */
export async function getOrderQuestions(orderId: number): Promise<OrderQuestionList> {
  const response = await request(`/orders/${orderId}/questions`, {
    errorMessage: "Не удалось загрузить вопросы",
  });

  return response.json();
}
