import type { MetadataRoute } from "next";
import { fetchPostSitemap } from "@/source/entities/posts/api/sitemap.api";
import { SITE_URL } from "@/source/shared/api/config";
import { NEWS_PAGE_SIZE, fetchArticleSitemap, type ArticleKind } from "@/source/entities/article";
import { RTN_MAX_PAGE, RTN_PAGE_SIZE, fetchRtnList, type RtnListItem } from "@/source/entities/rtn";

export const dynamic = "force-dynamic";
export const revalidate = 300;

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

const STATIC_ROUTES: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/orders", changeFrequency: "daily", priority: 0.9 },
  { path: "/posts", changeFrequency: "daily", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/rtn", changeFrequency: "daily", priority: 0.9 },
  { path: "/rtn/ask", changeFrequency: "monthly", priority: 0.8 },
  { path: "/nir", changeFrequency: "weekly", priority: 0.9 },
  { path: "/sudebnaya-ekspertiza", changeFrequency: "weekly", priority: 0.9 },
  { path: "/kadastrovye-raboty", changeFrequency: "weekly", priority: 0.9 },
  { path: "/audit-supb", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ekspertiza-promyshlennoy-bezopasnosti", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tehnicheskoe-diagnostirovanie", changeFrequency: "weekly", priority: 0.9 },
  { path: "/proektirovanie", changeFrequency: "weekly", priority: 0.9 },
  { path: "/ekologiya", changeFrequency: "weekly", priority: 0.9 },
  { path: "/inzhenernye-izyskaniya", changeFrequency: "weekly", priority: 0.9 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
  { path: "/zepb-registry", changeFrequency: "monthly", priority: 0.8 },
  { path: "/expert-contacts", changeFrequency: "weekly", priority: 0.8 },
  { path: "/training/defectoscopist-certification", changeFrequency: "monthly", priority: 0.8 },
  { path: "/requisites", changeFrequency: "yearly", priority: 0.3 },
  { path: "/offer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/user-agreement", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

async function loadArticles(kind: ArticleKind): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetchArticleSitemap(kind, { server: true });
    return items.map((item) => ({
      url: `${SITE_URL}/${kind}/${item.slug}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

/** Ссылки на вторую и следующие страницы списка: первая уже есть среди статичных. */
function listPages(path: string, total: number, pageSize: number, maxPage = Infinity): MetadataRoute.Sitemap {
  const pageCount = Math.min(maxPage, Math.ceil(total / pageSize));
  const pages = [...Array(Math.max(0, pageCount - 1)).keys()].map((index) => index + 2);
  return pages.map((page) => ({
    url: `${SITE_URL}${path}?page=${page}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));
}

async function fetchAllRtn(offset = 0): Promise<RtnListItem[]> {
  const page = await fetchRtnList({ filters: "", limit: RTN_PAGE_SIZE, offset }, { server: true });
  if (!page.has_more) return page.items;
  return [...page.items, ...(await fetchAllRtn(offset + RTN_PAGE_SIZE))];
}

async function loadRtnClarifications(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetchAllRtn();
    const details: MetadataRoute.Sitemap = items.map((item) => ({
      url: `${SITE_URL}/rtn/${item.slug}`,
      lastModified: item.published_at ? new Date(item.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...listPages("/rtn", items.length, RTN_PAGE_SIZE, RTN_MAX_PAGE), ...details];
  } catch {
    return [];
  }
}

/** Опубликованные оригиналы, без черновиков и репостов, и ленты их авторов. */
async function loadPosts(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await fetchPostSitemap();
    const posts: MetadataRoute.Sitemap = items.map((item) => ({
      url: `${SITE_URL}/posts/${item.id}`,
      lastModified: new Date(item.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const authorIds = new Set(items.map((item) => item.author_id));
    const authors: MetadataRoute.Sitemap = [...authorIds].map((authorId) => ({
      url: `${SITE_URL}/posts?author=${authorId}`,
      changeFrequency: "daily",
      priority: 0.5,
    }));

    return [...posts, ...authors];
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
  const [news, blog, rtn, posts] = await Promise.all([
    loadArticles("news"),
    loadArticles("blog"),
    loadRtnClarifications(),
    loadPosts(),
  ]);
  return [...staticItems, ...listPages("/news", news.length, NEWS_PAGE_SIZE), ...news, ...blog, ...rtn, ...posts];
}
