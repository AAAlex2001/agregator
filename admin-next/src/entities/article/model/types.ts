import type { BadgeTone } from "@/shared/ui/badge";

export type ArticleKind = "NEWS" | "BLOG";

export type ArticleStatus = "DRAFT" | "PUBLISHED";

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
