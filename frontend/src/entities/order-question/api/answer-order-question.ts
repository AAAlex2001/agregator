import { request } from "@/shared/api/request";
import type { OrderQuestion } from "../model/types";

/** Сохраняет первый ответ заказчика или новую редакцию его ответа. */
export async function answerOrderQuestion(
  questionId: number,
  answer: string,
): Promise<OrderQuestion> {
  const response = await request(`/questions/${questionId}/answer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer,
    }),
    errorMessage: "Не удалось отправить ответ",
  });

  return response.json();
}
