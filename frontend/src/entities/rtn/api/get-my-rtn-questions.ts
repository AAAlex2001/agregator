import { request } from "@/shared/api/request";
import type { RtnQuestion } from "../model/types";

/** Загружает обращения текущего пользователя и результаты их рассмотрения. */
export async function getMyRtnQuestions(): Promise<RtnQuestion[]> {
  const response = await request("/rtn/questions/mine", {
    errorMessage: "Не удалось загрузить ваши вопросы",
  });

  return response.json();
}
