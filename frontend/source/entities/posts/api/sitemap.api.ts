import "server-only";

import { SERVER_API_URL } from "@/source/shared/api/config";

interface PostSitemapItem {
  id: number;
  updated_at: string;
}

/** Загружает адреса опубликованных оригиналов без данных текущего пользователя. */
export async function fetchPostSitemap(): Promise<PostSitemapItem[]> {
  const items: PostSitemapItem[] = [];
  const limit = 1000;
  let afterId = 0;

  while (true) {
    const response = await fetch(
      `${SERVER_API_URL}/posts/sitemap?after_id=${afterId}&limit=${limit}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("Не удалось загрузить карту публикаций");

    const page: PostSitemapItem[] = await response.json();
    items.push(...page);
    if (page.length < limit) return items;
    afterId = page[page.length - 1].id;
  }
}
