import type { BadgeTone } from "@/shared/ui/badge";

export type ArticleKind = "NEWS" | "BLOG";

export type ArticleStatus = "DRAFT" | "PUBLISHED";

export type ArticleListItem = {
  id: number;
  kind: ArticleKind;
  status: ArticleStatus;
  title: string;
  slug: string;
  views_count: number;
  published_at: string | null;
  updated_at: string;
};

export type ArticleList = {
  items: ArticleListItem[];
  total: number;
};

export type ArticleListQuery = {
  kind: string;
  status: string;
  query: string;
  withComments: boolean;
  views: string;
};

export type ArticlePayload = {
  kind: ArticleKind;
  status: ArticleStatus;
  direction: string | null;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tg_cover_image: string;
  og_image: string;
  tags: string[];
  content_html: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  published_at: string | null;
};

export type Article = ArticlePayload & {
  id: number;
  created_at: string;
  updated_at: string;
};

export const ARTICLE_KIND_LABELS: Record<ArticleKind, string> = {
  NEWS: "Новость",
  BLOG: "Блог",
};

export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликована",
};

export const ARTICLE_STATUS_TONES: Record<ArticleStatus, BadgeTone> = {
  DRAFT: "neutral",
  PUBLISHED: "success",
};
