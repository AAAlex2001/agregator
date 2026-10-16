import { request } from "@/shared/api/request";

/** Передаёт обращение в Ростехнадзор; почту для ответа сервер берёт из аккаунта. */
export async function submitRtnQuestion(questionText: string): Promise<void> {
  await request("/public/rtn/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question_text: questionText,
    }),
    errorMessage: "Не удалось отправить вопрос",
  });
}
