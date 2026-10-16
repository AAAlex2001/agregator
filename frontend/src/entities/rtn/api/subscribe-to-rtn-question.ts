import { request } from "@/shared/api/request";

/** Подписывает указанный адрес на письмо о публикации официального ответа. */
export async function subscribeToRtnQuestion(
  questionId: number,
  email: string,
): Promise<void> {
  await request(`/public/rtn/questions/${questionId}/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    errorMessage: "Не удалось оформить подписку",
  });
}
