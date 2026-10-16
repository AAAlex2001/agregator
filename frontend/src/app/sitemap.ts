import type { MetadataRoute } from "next";
import { NEWS_PAGE_SIZE } from "@/entities/article";
import { SITE_URL } from "@/shared/config/site";
import { SITEMAP_ROUTES } from "./config/sitemap-routes";
import { loadArticleSitemapEntries } from "./seo/sitemap-articles";
import { createSitemapPages } from "./seo/sitemap-pages";
import { loadPostSitemapEntries } from "./seo/sitemap-posts";
import { loadRtnSitemapEntries } from "./seo/sitemap-rtn";

export const dynamic = "force-dynamic";
export const revalidate = 300;

/** Собирает публичную карту сайта, сохраняя доступные разделы при частичном сбое API. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = SITEMAP_ROUTES.map((route) => ({
    url: route.path === "/" ? SITE_URL : `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const [news, blog, rtn, posts] = await Promise.all([
    loadArticleSitemapEntries("news"),
    loadArticleSitemapEntries("blog"),
    loadRtnSitemapEntries(),
    loadPostSitemapEntries(),
  ]);
  const newsPages = createSitemapPages("/news", news.length, NEWS_PAGE_SIZE);

  return [
    ...staticEntries,
    ...newsPages,
    ...news,
    ...blog,
    ...rtn,
    ...posts,
  ];
}
