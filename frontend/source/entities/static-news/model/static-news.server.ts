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
  31: () => import("../content/articles-31"),
  32: () => import("../content/articles-32"),
  33: () => import("../content/articles-33"),
  34: () => import("../content/articles-34"),
  35: () => import("../content/articles-35"),
  36: () => import("../content/articles-36"),
  37: () => import("../content/articles-37"),
  38: () => import("../content/articles-38"),
  39: () => import("../content/articles-39"),
  40: () => import("../content/articles-40"),
  41: () => import("../content/articles-41"),
  42: () => import("../content/articles-42"),
  43: () => import("../content/articles-43"),
  44: () => import("../content/articles-44"),
  45: () => import("../content/articles-45"),
  46: () => import("../content/articles-46"),
  47: () => import("../content/articles-47"),
  48: () => import("../content/articles-48"),
  49: () => import("../content/articles-49"),
  50: () => import("../content/articles-50"),
  51: () => import("../content/articles-51"),
  52: () => import("../content/articles-52"),
  53: () => import("../content/articles-53"),
  54: () => import("../content/articles-54"),
  55: () => import("../content/articles-55"),
  56: () => import("../content/articles-56"),
  57: () => import("../content/articles-57"),
  58: () => import("../content/articles-58"),
  59: () => import("../content/articles-59"),
  60: () => import("../content/articles-60"),
  61: () => import("../content/articles-61"),
  62: () => import("../content/articles-62"),
};

export const STATIC_NEWS_SLUGS = STATIC_NEWS_INDEX.map((item) => item.slug);

/** Шарды новостей, написанные под конкретное направление платформы. */
const DIRECTION_SHARDS: Record<string, number[]> = {
  EXPERTISE: [31, 40, 41, 42, 43, 45, 46],
  AUDIT_SUPB: [32, 47, 48],
  TECH_DIAG: [33, 44, 49, 50],
  DESIGN: [34, 51, 52],
  SURVEY: [35, 53, 54],
  ECOLOGY: [36, 55, 56],
  RESEARCH: [37, 57, 58],
  CADASTRAL: [38, 59, 60],
  FORENSIC: [39, 61, 62],
};

export function getStaticNewsByDirection(direction: string, limit = 12): ArticleListItem[] {
  const shards = DIRECTION_SHARDS[direction] ?? [];
  return STATIC_NEWS_INDEX.filter((item) => shards.includes(item.shard))
    .sort((left, right) => (right.published_at ?? "").localeCompare(left.published_at ?? ""))
    .slice(0, limit)
    .map((item) => ({
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
