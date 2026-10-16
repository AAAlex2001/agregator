import "server-only";

import type { ArticleListItem } from "@/entities/article";
import { getArticlesOnServer } from "@/entities/article/server";
import type { DirectionCode } from "@/entities/direction";

/** Загружает новости направления; недоступный список скрывает только их секцию. */
export async function loadServiceNews(
  direction: DirectionCode,
): Promise<ArticleListItem[]> {
  try {
    const page = await getArticlesOnServer({
      kind: "news",
      direction,
      limit: 12,
    });

    return page.items;
  } catch {
    return [];
  }
}
