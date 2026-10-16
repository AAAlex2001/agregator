import type { MetadataRoute } from "next";
import { getPostSitemap } from "@/entities/post/server";
import { SITE_URL } from "@/shared/config/site";

/** Добавляет опубликованные оригиналы постов и по одной ссылке на ленту каждого автора. */
export async function loadPostSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await getPostSitemap();
    const posts: MetadataRoute.Sitemap = items.map((post) => ({
      url: `${SITE_URL}/posts/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
    const authorIds = [...new Set(items.map((post) => post.author_id))];
    const authors: MetadataRoute.Sitemap = authorIds.map((authorId) => ({
      url: `${SITE_URL}/posts?author=${authorId}`,
      changeFrequency: "daily",
      priority: 0.5,
    }));

    return [...posts, ...authors];
  } catch {
    return [];
  }
}
