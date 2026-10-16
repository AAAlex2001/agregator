import { request } from "@/shared/api/request";
import type { ArticleReaction, ArticleReactions } from "../model/types";

/** Сохраняет оценку статьи и возвращает обновлённые счётчики. */
export async function sendArticleReaction(
  articleId: number,
  value: ArticleReaction,
): Promise<ArticleReactions> {
  const response = await request(`/public/articles/${articleId}/reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
    errorMessage: "Не удалось сохранить оценку",
  });

  return response.json();
}

