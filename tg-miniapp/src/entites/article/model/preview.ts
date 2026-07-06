import type { ArticleDetail, ArticleListItem } from "./types";

export function articleImage(article: Pick<ArticleListItem | ArticleDetail, "tg_cover_image" | "cover_image">): string {
  return article.tg_cover_image || article.cover_image;
}
