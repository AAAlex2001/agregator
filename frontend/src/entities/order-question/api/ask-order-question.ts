import { request } from "@/shared/api/request";
import type { OrderQuestion } from "../model/types";

/** Отправляет единственный вопрос исполнителя по выбранному заказу. */
export async function askOrderQuestion(
  orderId: number,
  question: string,
  isAnonymous: boolean,
): Promise<OrderQuestion> {
  const response = await request(`/orders/${orderId}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      is_anonymous: isAnonymous,
    }),
    errorMessage: "Не удалось отправить вопрос",
  });

  return response.json();
}
