import type { ArticleReactions } from "@/entities/article";

/** Статья и серверные счётчики для формы оценки полезности. */
export interface RateArticleProps {
  articleId: number;
  initial?: ArticleReactions;
}
