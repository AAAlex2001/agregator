import { SERVER_API_URL } from "@/shared/config/server-api";
import type { ArticleListPage, ArticleListQuery } from "../model/types";
import { createArticleQuery } from "./article-query";

/** Загружает статьи для серверного HTML по внутреннему адресу API. */
export async function getArticlesOnServer(
  query: ArticleListQuery,
): Promise<ArticleListPage> {
  const params = createArticleQuery(query);
  const response = await fetch(`${SERVER_API_URL}/public/articles?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить статьи: ${response.status}`);
  }

  return response.json();
}
