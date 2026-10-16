import { request } from "@/shared/api/request";
import type { PublicRtnQuestion } from "../model/types";

/** Загружает обращения, доступные всем посетителям раздела. */
export async function getPublicRtnQuestions(): Promise<PublicRtnQuestion[]> {
  const response = await request("/public/rtn/questions", {
    errorMessage: "Не удалось загрузить вопросы",
  });

  return response.json();
}
