import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";
import { fetchArticleList, type ArticleKind } from "@/source/entities/article";
import { getStaticNewsListItems } from "@/source/entities/static-news";
import { fetchRtnList } from "@/source/entities/rtn-clarification";

export const dynamic = "force-dynamic";
export const revalidate = 300;

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/orders", changeFrequency: "daily", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/rtn", changeFrequency: "daily", priority: 0.9 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
  { path: "/zepb-registry", changeFrequency: "monthly", priority: 0.8 },
  { path: "/expert-contacts", changeFrequency: "weekly", priority: 0.8 },
  { path: "/training/defectoscopist-certification", changeFrequency: "monthly", priority: 0.8 },
  { path: "/register", changeFrequency: "monthly", priority: 0.7 },
  { path: "/login", changeFrequency: "monthly", priority: 0.4 },
  { path: "/forgot-password", changeFrequency: "yearly", priority: 0.3 },
  { path: "/requisites", changeFrequency: "yearly", priority: 0.3 },
  { path: "/offer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/user-agreement", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

async function loadArticles(kind: ArticleKind): Promise<MetadataRoute.Sitemap> {
  try {
    const items = [];
    const limit = 48;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await fetchArticleList({ kind, limit, offset }, { server: true });
      items.push(...page.items);
      hasMore = page.has_more;
      offset += limit;
    }

    return items.map((item) => ({
      url: `${SITE_URL}/${kind}/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

async function loadRtnClarifications(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = [];
    const limit = 48;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const page = await fetchRtnList({ limit, offset }, { server: true });
      items.push(...page.items);
      hasMore = page.has_more;
      offset += limit;
    }

    return items.map((item) => ({
      url: `${SITE_URL}/rtn/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticItems: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
  const [news, blog, rtn] = await Promise.all([
    loadArticles("news"),
    loadArticles("blog"),
    loadRtnClarifications(),
  ]);
  const staticNews = getStaticNewsListItems().map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.published_at ? new Date(item.published_at) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const staticUrls = new Set(staticNews.map((item) => item.url));
  return [...staticItems, ...staticNews, ...news.filter((item) => !staticUrls.has(item.url)), ...blog, ...rtn];
}
