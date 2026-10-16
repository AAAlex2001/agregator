import { request } from "@/shared/api/request";

/** Ответ ИИ-помощника с готовым текстом публикации. */
interface AssistantAnswer {
  html: string;
}

/** Просит ИИ-помощника написать пост или переделать текущий текст. */
export async function writePostWithAi(instruction: string, html: string): Promise<string> {
  const response = await request("/posts/assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instruction, html }),
    errorMessage: "ИИ-помощник сейчас недоступен",
  });
  const answer: AssistantAnswer = await response.json();

  return answer.html;
}
