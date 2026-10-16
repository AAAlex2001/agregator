import { request } from "@/shared/api/request";
import type { RtnReaction, RtnReactions } from "../model/types";

/** Сохраняет выбранную оценку и возвращает обновлённые серверные счётчики. */
export async function sendRtnReaction(
  clarificationId: number,
  value: RtnReaction,
): Promise<RtnReactions> {
  const response = await request(
    `/public/rtn/clarifications/${clarificationId}/reaction`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
      errorMessage: "Не удалось сохранить оценку",
    },
  );

  return response.json();
}
