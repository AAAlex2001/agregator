import { request } from "@/shared/api/request";
import type { ArticleComment, ArticleCommentsResponse } from "../model/types";

/** Загружает обсуждение с отметками собственных комментариев посетителя. */
export async function getArticleComments(
  articleId: number,
): Promise<ArticleComment[]> {
  const response = await request(`/public/articles/${articleId}/comments`, {
    errorMessage: "Не удалось загрузить комментарии",
  });
  const data: ArticleCommentsResponse = await response.json();

  return data.items;
}

