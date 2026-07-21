import type { StaticNewsArticle } from "../model/types";

export type StaticNewsArticleInput = Omit<
  StaticNewsArticle,
  | "kind"
  | "cover_image"
  | "tg_cover_image"
  | "og_image"
  | "likes_count"
  | "dislikes_count"
  | "views_count"
  | "updated_at"
>;

export function defineStaticNewsArticle(input: StaticNewsArticleInput): StaticNewsArticle {
  const cover = `/articles/static-news/${input.slug}.webp`;
  return {
    ...input,
    kind: "news",
    cover_image: cover,
    tg_cover_image: cover,
    og_image: cover,
    updated_at: input.published_at ?? "2026-07-20T09:00:00Z",
    likes_count: 0,
    dislikes_count: 0,
    views_count: 0,
  };
}
