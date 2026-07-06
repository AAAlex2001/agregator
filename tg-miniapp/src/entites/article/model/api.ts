import { apiJson } from "@/shared/services/api";
import type { ArticleDetail, ArticleKind, ArticleList, ArticleReactions, ReactionValue } from "./types";

export function listArticles(kind: ArticleKind, limit = 12, offset = 0): Promise<ArticleList> {
  return apiJson<ArticleList>(`/public/articles?kind=${kind}&limit=${limit}&offset=${offset}`);
}

export function fetchArticle(slug: string): Promise<ArticleDetail> {
  return apiJson<ArticleDetail>(`/public/articles/${slug}`);
}

export function fetchArticleReactions(articleId: number): Promise<ArticleReactions> {
  return apiJson<ArticleReactions>(`/public/articles/${articleId}/reactions`);
}

export function reactToArticle(articleId: number, value: ReactionValue): Promise<ArticleReactions> {
  return apiJson<ArticleReactions>(`/public/articles/${articleId}/reaction`, {
    method: "POST",
    body: JSON.stringify({ value }),
  });
}
