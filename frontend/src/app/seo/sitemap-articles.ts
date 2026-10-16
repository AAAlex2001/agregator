import type { MetadataRoute } from "next";
import { getArticleSitemap } from "@/entities/article/server";
import type { ArticleKind } from "@/entities/article";
import { SITE_URL } from "@/shared/config/site";

/** Добавляет опубликованные статьи раздела; сбой API не скрывает другие разделы. */
export async function loadArticleSitemapEntries(
  kind: ArticleKind,
): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await getArticleSitemap(kind);

    return articles.map((article) => ({
      url: `${SITE_URL}/${kind}/${article.slug}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}
