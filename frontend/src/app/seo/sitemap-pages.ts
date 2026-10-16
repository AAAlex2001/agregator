import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

/** Добавляет страницы списка со второй: первая уже есть среди постоянных маршрутов. */
export function createSitemapPages(
  path: string,
  total: number,
  pageSize: number,
  maxPage = Infinity,
): MetadataRoute.Sitemap {
  const pageCount = Math.min(maxPage, Math.ceil(total / pageSize));
  const entries: MetadataRoute.Sitemap = [];

  for (let page = 2; page <= pageCount; page += 1) {
    entries.push({
      url: `${SITE_URL}${path}?page=${page}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    });
  }

  return entries;
}
