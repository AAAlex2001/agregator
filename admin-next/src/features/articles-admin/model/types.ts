import type { Article, ArticleKind, ArticleList, ArticleListQuery, ArticleStatus } from "@/entities/article";
import type { Tag } from "@/entities/tag";

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

export type ListState = {
  search: string;
  filters: ArticleListQuery;
  page: number;
  list: ArticleList | null;
  loading: boolean;
  failed: boolean;
};

export type ListAction =
  | { type: "search/change"; value: string }
  | { type: "load/start"; filters: ArticleListQuery; page: number }
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
