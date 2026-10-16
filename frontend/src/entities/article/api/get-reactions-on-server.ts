import { SERVER_API_URL } from "@/shared/config/server-api";
import type { ArticleReactions } from "../model/types";

/** Загружает публичные счётчики статьи для серверного HTML без сессии посетителя. */
export async function getArticleReactionsOnServer(
  articleId: number,
): Promise<ArticleReactions> {
  const response = await fetch(
    `${SERVER_API_URL}/public/articles/${articleId}/reactions`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Не удалось загрузить оценки: ${response.status}`);
  }

  return response.json();
}
