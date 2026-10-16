import { request } from "@/shared/api/request";
import type { ArticleComment } from "../model/types";

/** Отправляет комментарий к статье или ответ указанному комментарию. */
export async function addArticleComment(
  articleId: number,
  text: string,
  parentId: number | null,
): Promise<ArticleComment> {
  const response = await request(`/public/articles/${articleId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      parent_id: parentId,
    }),
    errorMessage: "Не удалось отправить комментарий",
  });

  return response.json();
}

