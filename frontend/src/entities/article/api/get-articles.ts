import { API_URL } from "@/shared/config/api";
import type { ArticleListPage, ArticleListQuery } from "../model/types";
import { createArticleQuery } from "./article-query";

/** Загружает публичные статьи в браузере по выбранным фильтрам. */
export async function getArticles(query: ArticleListQuery): Promise<ArticleListPage> {
  const params = createArticleQuery(query);
  const response = await fetch(`${API_URL}/public/articles?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить статьи: ${response.status}`);
  }

  return response.json();
}
