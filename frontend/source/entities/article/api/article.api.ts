import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";
import type { ArticleDetail, ArticleKind, ArticleList, ArticleListItem, ArticleListQuery, ArticleSitemapItem } from "../model/types";

interface FetchOptions {
  server?: boolean;
}

/** Публичные статьи читаются без сессии; с сервера Next ходим по внутреннему адресу API. */
function articlesUrl(path: string, options: FetchOptions): string {
  return `${options.server ? SERVER_API_URL : API_URL}/public/articles${path}`;
}

/** Страница новостей или блога с фильтрами по тегу и направлению. */
export async function fetchArticleList(query: ArticleListQuery, options: FetchOptions = {}): Promise<ArticleList> {
  const params = new URLSearchParams({ kind: query.kind });
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));
  if (query.tag) params.set("tag", query.tag);
  if (query.direction) params.set("direction", query.direction);

  const response = await fetch(articlesUrl(`?${params}`, options), { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось загрузить статьи: ${response.status}`);
  return response.json();
}

/** Все опубликованные статьи раздела для sitemap. */
export async function fetchArticleSitemap(kind: ArticleKind, options: FetchOptions = {}): Promise<ArticleSitemapItem[]> {
  const response = await fetch(articlesUrl(`/sitemap?kind=${kind}`, options), { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось загрузить карту статей: ${response.status}`);
  return response.json();
}

/** Статья по адресу или null, если её нет. */
export async function fetchArticleBySlug(slug: string, options: FetchOptions = {}): Promise<ArticleDetail | null> {
  const response = await fetch(articlesUrl(`/${encodeURIComponent(slug)}`, options), { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Не удалось загрузить статью: ${response.status}`);
  return response.json();
}

/** Похожие статьи для слайдера под текстом; при ошибке слайдер просто не показывается. */
export async function fetchRelatedArticles(slug: string, limit: number, options: FetchOptions = {}): Promise<ArticleListItem[]> {
  const response = await fetch(articlesUrl(`/${encodeURIComponent(slug)}/related?limit=${limit}`, options), { cache: "no-store" });
  if (!response.ok) return [];
  return response.json();
}

/** Засчитать просмотр. Счётчик не критичен, поэтому ошибки глотаем. */
export async function recordArticleView(articleId: number): Promise<void> {
  await fetchWithSession(`${API_URL}/public/articles/${articleId}/view`, { method: "POST" }).catch(() => undefined);
}
