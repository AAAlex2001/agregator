import { request } from "@/shared/api/request";
import type { RtnQuestionReply } from "../model/types";
import type { RtnFile } from "../model/types";

/** Публикует пояснение к ответу ведомства с ранее загруженными документами. */
export async function addRtnQuestionReply(
  questionId: number,
  text: string,
  attachments: RtnFile[],
): Promise<RtnQuestionReply> {
  const response = await request(`/public/rtn/questions/${questionId}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      attachments,
    }),
    errorMessage: "Не удалось опубликовать ответ",
  });

  return response.json();
}
