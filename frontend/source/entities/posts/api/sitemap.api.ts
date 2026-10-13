import "server-only";

import { SERVER_API_URL } from "@/source/shared/api/config";

interface PostSitemapItem {
  id: number;
  author_id: number;
  updated_at: string;
}

/** Опубликованные оригиналы для карты сайта: id, автор и дата изменения. */
export async function fetchPostSitemap(): Promise<PostSitemapItem[]> {
  const response = await fetch(`${SERVER_API_URL}/posts/sitemap`, {
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(`Не удалось загрузить карту публикаций: ${response.status}`);
  }
  return response.json();
}
