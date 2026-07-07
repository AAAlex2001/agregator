import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";
import { fetchArticleList, type ArticleKind } from "@/source/entities/article";

export const dynamic = "force-dynamic";
export const revalidate = 300;

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/orders", changeFrequency: "daily", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
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
      changeFrequency: kind === "news" ? "weekly" : "monthly",
      priority: kind === "news" ? 0.8 : 0.6,
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
  const [news, blog] = await Promise.all([loadArticles("news"), loadArticles("blog")]);
  return [...staticItems, ...news, ...blog];
}
