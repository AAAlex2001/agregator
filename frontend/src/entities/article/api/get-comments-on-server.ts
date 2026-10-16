import { SERVER_API_URL } from "@/shared/config/server-api";
import type {
  ArticleComment,
  ArticleCommentsResponse,
} from "../model/types";

/** Загружает комментарии для серверного HTML без личных отметок посетителя. */
export async function getArticleCommentsOnServer(
  articleId: number,
): Promise<ArticleComment[]> {
  const response = await fetch(
    `${SERVER_API_URL}/public/articles/${articleId}/comments`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Не удалось загрузить комментарии: ${response.status}`);
  }

  const data: ArticleCommentsResponse = await response.json();
  return data.items;
}
