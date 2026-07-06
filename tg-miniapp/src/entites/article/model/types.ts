export type ArticleKind = "news" | "blog";

export interface ArticleListItem {
  id: number;
  kind: ArticleKind;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  tg_cover_image: string;
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

export type ReactionValue = "LIKE" | "DISLIKE";

export interface ArticleReactions {
  likes_count: number;
  dislikes_count: number;
  my_reaction: ReactionValue | null;
}
