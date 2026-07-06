export type ArticleKind = "NEWS" | "BLOG";
export type ArticleStatus = "DRAFT" | "PUBLISHED";

// что приходит при загрузке статьи
export type ArticleIn = {
  id: number;
  kind: ArticleKind;
  status: ArticleStatus;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  tgCoverImage: string;
  tags: string[];
  contentHtml: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  publishedAt: string | null;
};

// что уходит при сохранении
export type ArticleOut = Omit<ArticleIn, "id">;

export type ArticleListItem = {
  id: number;
  kind: ArticleKind;
  status: ArticleStatus;
  title: string;
  slug: string;
  publishedAt: string | null;
  updatedAt: string;
};

export const EMPTY_ARTICLE: ArticleOut = {
  kind: "NEWS",
  status: "DRAFT",
  slug: "",
  title: "",
  excerpt: "",
  coverImage: "",
  tgCoverImage: "",
  tags: [],
  contentHtml: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogImage: "",
  publishedAt: null,
};

export const toOut = (a: ArticleIn): ArticleOut => ({
  kind: a.kind,
  status: a.status,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  coverImage: a.coverImage,
  tgCoverImage: a.tgCoverImage,
  tags: a.tags,
  contentHtml: a.contentHtml,
  metaTitle: a.metaTitle,
  metaDescription: a.metaDescription,
  metaKeywords: a.metaKeywords,
  ogImage: a.ogImage,
  publishedAt: a.publishedAt,
});
