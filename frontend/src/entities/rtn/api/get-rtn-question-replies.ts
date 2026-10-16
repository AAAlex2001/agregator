import { request } from "@/shared/api/request";
import type { RtnQuestionReply } from "../model/types";

/** Загружает ответы ведомств, опубликованные участниками под обращением. */
export async function getRtnQuestionReplies(questionId: number): Promise<RtnQuestionReply[]> {
  const response = await request(`/public/rtn/questions/${questionId}/replies`, {
    errorMessage: "Не удалось загрузить ответы",
  });

  return response.json();
}
