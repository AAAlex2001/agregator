import { request } from "@/shared/api/request";
import type { ArticleReactions } from "../model/types";

/** Загружает счётчики и оценку текущего посетителя статьи. */
export async function getArticleReactions(
  articleId: number,
): Promise<ArticleReactions> {
  const response = await request(`/public/articles/${articleId}/reactions`, {
    errorMessage: "Не удалось загрузить оценки",
  });

  return response.json();
}

