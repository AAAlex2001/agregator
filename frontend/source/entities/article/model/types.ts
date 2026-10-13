export type ArticleKind = "news" | "blog";

export interface ArticleListItem {
  id: number;
  kind: ArticleKind;
  direction: string | null;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tg_cover_image: string;
  tags: string[];
  published_at: string | null;
  likes_count: number;
  dislikes_count: number;
  views_count: number;
}

export interface ArticleList {
  items: ArticleListItem[];
  has_more: boolean;
}

export interface ArticleDetail extends ArticleListItem {
  content_html: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  updated_at: string;
}

export interface ArticleSitemapItem {
  slug: string;
  published_at: string | null;
  updated_at: string;
}

export interface ArticleListQuery {
  kind: ArticleKind;
  limit?: number;
  offset?: number;
  tag?: string;
  direction?: string;
}

export interface ArticleComment {
  id: number;
  parent_id: number | null;
  text: string;
  author_name: string;
  created_at: string;
  is_mine: boolean;
}

export type ReactionValue = "LIKE" | "DISLIKE";

export interface ReactionState {
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  my_reaction: ReactionValue | null;
}
