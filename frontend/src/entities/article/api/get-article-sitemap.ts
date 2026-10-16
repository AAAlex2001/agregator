import { SERVER_API_URL } from "@/shared/config/server-api";
import type { ArticleKind, ArticleSitemapItem } from "../model/types";

/** Загружает ссылки на все опубликованные статьи раздела для карты сайта. */
export async function getArticleSitemap(
  kind: ArticleKind,
): Promise<ArticleSitemapItem[]> {
  const response = await fetch(
    `${SERVER_API_URL}/public/articles/sitemap?kind=${kind}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Не удалось загрузить карту статей: ${response.status}`);
  }

  return response.json();
}
