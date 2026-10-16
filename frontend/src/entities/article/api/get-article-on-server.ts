import { SERVER_API_URL } from "@/shared/config/server-api";
import type { Article } from "../model/types";

/** Загружает полный текст статьи для страницы и SEO; отсутствие возвращает как null. */
export async function getArticleOnServer(slug: string): Promise<Article | null> {
  const path = `/public/articles/${encodeURIComponent(slug)}`;
  const response = await fetch(`${SERVER_API_URL}${path}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить статью: ${response.status}`);
  }

  return response.json();
}
