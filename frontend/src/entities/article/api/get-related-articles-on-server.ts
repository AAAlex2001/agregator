import { SERVER_API_URL } from "@/shared/config/server-api";
import type { ArticleListItem } from "../model/types";

/** Загружает похожие статьи; отказ API оставляет блок рекомендаций пустым. */
export async function getRelatedArticlesOnServer(
  slug: string,
  limit: number,
): Promise<ArticleListItem[]> {
  const path = `/public/articles/${encodeURIComponent(slug)}/related?limit=${limit}`;
  const response = await fetch(`${SERVER_API_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
