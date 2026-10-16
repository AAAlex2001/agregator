import { request } from "@/shared/api/request";
import type { OrderQuestion } from "../model/types";

/** Меняет текст вопроса автора, сохраняя выбранную ранее видимость. */
export async function updateOrderQuestion(
  questionId: number,
  question: string,
): Promise<OrderQuestion> {
  const response = await request(`/questions/${questionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
    errorMessage: "Не удалось обновить вопрос",
  });

  return response.json();
}
