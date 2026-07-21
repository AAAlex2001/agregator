import "server-only";

import type { ArticleListItem } from "@/source/entities/article";
import { STATIC_NEWS_INDEX } from "../content/news-index";
import type { StaticNewsArticle } from "./types";

type ShardModule = { default: readonly StaticNewsArticle[] };

const SHARD_LOADERS: Record<number, () => Promise<ShardModule>> = {
  1: () => import("../content/articles-01"),
  2: () => import("../content/articles-02"),
  3: () => import("../content/articles-03"),
  4: () => import("../content/articles-04"),
  5: () => import("../content/articles-05"),
  6: () => import("../content/articles-06"),
  7: () => import("../content/articles-07"),
  8: () => import("../content/articles-08"),
  9: () => import("../content/articles-09"),
  10: () => import("../content/articles-10"),
};

export const STATIC_NEWS_SLUGS = STATIC_NEWS_INDEX.map((item) => item.slug);

export async function getStaticNewsArticle(slug: string): Promise<StaticNewsArticle | null> {
  const indexItem = STATIC_NEWS_INDEX.find((item) => item.slug === slug);
  if (!indexItem) return null;
  const shard = await SHARD_LOADERS[indexItem.shard]();
  return shard.default.find((article) => article.slug === slug) ?? null;
}

export function getStaticNewsListItems(): ArticleListItem[] {
  return STATIC_NEWS_INDEX.map((item) => ({
    id: item.id,
    kind: item.kind,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    cover_image: item.cover_image,
    tg_cover_image: item.tg_cover_image,
    tags: item.tags,
    published_at: item.published_at,
    likes_count: item.likes_count,
    dislikes_count: item.dislikes_count,
    views_count: item.views_count,
  }));
}

export function getStaticRelatedNews(slug: string, limit = 10): ArticleListItem[] {
  const current = STATIC_NEWS_INDEX.find((item) => item.slug === slug);
  if (!current) return [];
  const currentTags = new Set(current.tags);
  return getStaticNewsListItems()
    .filter((item) => item.slug !== slug)
    .sort((left, right) => {
      const leftScore = left.tags.filter((tag) => currentTags.has(tag)).length;
      const rightScore = right.tags.filter((tag) => currentTags.has(tag)).length;
      return rightScore - leftScore;
    })
    .slice(0, limit);
}
