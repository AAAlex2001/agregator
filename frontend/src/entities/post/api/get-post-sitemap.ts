import "server-only";

import { SERVER_API_URL } from "@/shared/config/server-api";
import type { PostSitemapItem } from "../model/types";

/** Загружает опубликованные оригиналы постов для карты сайта с кешем на пять минут. */
export async function getPostSitemap(): Promise<PostSitemapItem[]> {
  const response = await fetch(`${SERVER_API_URL}/posts/sitemap`, {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Не удалось загрузить карту публикаций: ${response.status}`);
  }

  return response.json();
}
