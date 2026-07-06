export type ArticleKind = "news" | "blog";

export interface ArticleListItem {
  id: number;
  kind: ArticleKind;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tags: string[];
  published_at: string | null;
  likes_count: number;
  views_count: number;
}

export interface ArticleDetail extends ArticleListItem {
  content_html: string;
  updated_at: string;
}

export interface ArticleList {
  items: ArticleListItem[];
  has_more: boolean;
}
