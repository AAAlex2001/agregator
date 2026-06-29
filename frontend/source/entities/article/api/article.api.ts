import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";
import { fetchWithSession } from "@/source/shared/api/session";

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
  dislikes_count: number;
  views_count: number;
}

export interface ArticleList {
  items: ArticleListItem[];
  has_more: boolean;
}

export interface ArticleDetail {
  id: number;
  kind: ArticleKind;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  content_html: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  published_at: string | null;
  updated_at: string;
  likes_count: number;
  dislikes_count: number;
  views_count: number;
}

function base(server: boolean): string {
  return server ? SERVER_API_URL : API_URL;
}

export async function fetchArticleList(
  args: { kind: ArticleKind; limit?: number; offset?: number; tag?: string },
  opts: { server?: boolean } = {},
): Promise<ArticleList> {
  const params = new URLSearchParams({ kind: args.kind });
  if (args.limit !== undefined) params.set("limit", String(args.limit));
  if (args.offset !== undefined) params.set("offset", String(args.offset));
  if (args.tag) params.set("tag", args.tag);

  const res = await fetch(`${base(Boolean(opts.server))}/public/articles?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не удалось загрузить статьи: ${res.status}`);
  return res.json();
}

export async function fetchArticleBySlug(
  slug: string,
  opts: { server?: boolean } = {},
): Promise<ArticleDetail | null> {
  const res = await fetch(`${base(Boolean(opts.server))}/public/articles/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Не удалось загрузить статью: ${res.status}`);
  return res.json();
}

export async function recordArticleView(articleId: number): Promise<number | null> {
  try {
    const res = await fetchWithSession(`${API_URL}/public/articles/${articleId}/view`, {
      method: "POST",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.views_count as number;
  } catch {
    return null;
  }
}

export async function fetchRelatedArticles(
  slug: string,
  opts: { limit?: number; server?: boolean } = {},
): Promise<ArticleListItem[]> {
  const params = new URLSearchParams();
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const res = await fetch(
    `${base(Boolean(opts.server))}/public/articles/${encodeURIComponent(slug)}/related${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json();
}
