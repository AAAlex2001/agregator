import { request } from "@/shared/api/request";
import type { RtnCommentCounters, RtnCommentReaction } from "../model/types";

/** Сохраняет отметку комментария и возвращает его актуальные счётчики. */
export async function reactToRtnComment(
  commentId: number,
  value: RtnCommentReaction,
): Promise<RtnCommentCounters> {
  const response = await request(`/public/rtn/comments/${commentId}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
    errorMessage: "Не удалось сохранить реакцию",
  });

  return response.json();
}
