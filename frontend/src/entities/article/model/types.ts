/** Публичный раздел, которому принадлежит статья. */
export type ArticleKind = "news" | "blog";

/** Карточка опубликованной новости или статьи блога из API. */
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

/** Страница статей и признак наличия следующих записей. */
export interface ArticleListPage {
  items: ArticleListItem[];
  has_more: boolean;
}

/** Полный текст статьи и её поисковые метаданные из API. */
export interface Article extends ArticleListItem {
  content_html: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  updated_at: string;
}

/** Параметры страницы статей с фильтрами по тегу и направлению. */
export interface ArticleListQuery {
  kind: ArticleKind;
  limit?: number;
  offset?: number;
  tag?: string;
  direction?: string;
}

/** Оценка полезности статьи, отправляемая в API. */
export type ArticleReaction = "LIKE" | "DISLIKE";

/** Счётчики статьи и оценка текущего посетителя. */
export interface ArticleReactions {
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  my_reaction: ArticleReaction | null;
}

/** Комментарий или ответ под статьёй с признаком принадлежности текущему посетителю. */
export interface ArticleComment {
  id: number;
  parent_id: number | null;
  text: string;
  author_name: string;
  created_at: string;
  is_mine: boolean;
}

/** Ответ API со всеми комментариями и ответами под статьёй. */
export interface ArticleCommentsResponse {
  items: ArticleComment[];
}

/** Ссылка на опубликованную статью и даты для карты сайта. */
export interface ArticleSitemapItem {
  slug: string;
  published_at: string | null;
  updated_at: string;
}
