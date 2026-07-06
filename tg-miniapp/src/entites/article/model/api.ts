import { apiJson } from "@/shared/services/api";
import type { ArticleDetail, ArticleKind, ArticleList } from "./types";

export function listArticles(kind: ArticleKind, limit = 12, offset = 0): Promise<ArticleList> {
  return apiJson<ArticleList>(`/public/articles?kind=${kind}&limit=${limit}&offset=${offset}`);
}

export function fetchArticle(slug: string): Promise<ArticleDetail> {
  return apiJson<ArticleDetail>(`/public/articles/${slug}`);
}
