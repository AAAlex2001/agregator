import type { ArticleKind, ArticleStatus } from "@/entities/article";
import type { Tag } from "@/entities/tag";

export type ArticleListItem = {
  id: number;
  kind: ArticleKind;
  status: ArticleStatus;
  title: string;
  slug: string;
  published_at: string | null;
  updated_at: string;
};

export type ArticleList = {
  items: ArticleListItem[];
  total: number;
};

export type Article = {
  id: number;
  kind: ArticleKind;
  status: ArticleStatus;
  direction: string | null;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tg_cover_image: string;
  tags: string[];
  content_html: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticlePayload = Omit<Article, "id" | "created_at" | "updated_at">;

export type ArticleFields = {
  kind: ArticleKind;
  status: ArticleStatus;
  direction: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  tgCoverImage: string;
  ogImage: string;
  tags: string[];
  contentHtml: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  publishedAt: string | null;
};

export type ListFilters = {
  kind: string;
  status: string;
  query: string;
};

export type ListState = {
  search: string;
  filters: ListFilters;
  page: number;
  list: ArticleList | null;
  loading: boolean;
  failed: boolean;
};

export type ListAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; filters: ListFilters; page: number }
  | { type: "load/success"; list: ArticleList }
  | { type: "load/error" };

export type EditorState = {
  status: "loading" | "ready" | "failed";
  article: Article | null;
  fields: ArticleFields;
  tags: Tag[];
  pending: boolean;
  confirming: boolean;
};

export type EditorAction =
  | { type: "load/success"; article: Article | null; tags: Tag[] }
  | { type: "load/error" }
  | { type: "fields/change"; changes: Partial<ArticleFields> }
  | { type: "save/start" }
  | { type: "save/finish" }
  | { type: "remove/ask" }
  | { type: "remove/cancel" };
