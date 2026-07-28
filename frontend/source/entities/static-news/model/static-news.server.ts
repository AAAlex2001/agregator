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
  11: () => import("../content/articles-11"),
  12: () => import("../content/articles-12"),
  13: () => import("../content/articles-13"),
  14: () => import("../content/articles-14"),
  15: () => import("../content/articles-15"),
  16: () => import("../content/articles-16"),
  17: () => import("../content/articles-17"),
  18: () => import("../content/articles-18"),
  19: () => import("../content/articles-19"),
  20: () => import("../content/articles-20"),
  21: () => import("../content/articles-21"),
  22: () => import("../content/articles-22"),
  23: () => import("../content/articles-23"),
  24: () => import("../content/articles-24"),
  25: () => import("../content/articles-25"),
  26: () => import("../content/articles-26"),
  27: () => import("../content/articles-27"),
  28: () => import("../content/articles-28"),
  29: () => import("../content/articles-29"),
  30: () => import("../content/articles-30"),
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
