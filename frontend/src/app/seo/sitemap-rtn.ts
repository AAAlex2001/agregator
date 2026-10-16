import type { MetadataRoute } from "next";
import { RTN_MAX_PAGE, RTN_PAGE_SIZE } from "@/entities/rtn";
import type { RtnListItem } from "@/entities/rtn";
import { getRtnListOnServer } from "@/entities/rtn/server";
import { SITE_URL } from "@/shared/config/site";
import { createSitemapPages } from "./sitemap-pages";

/** Последовательно загружает все опубликованные разъяснения без фильтров. */
async function loadAllRtnClarifications(): Promise<RtnListItem[]> {
  const items: RtnListItem[] = [];
  let offset = 0;

  while (true) {
    const page = await getRtnListOnServer({
      filters: "",
      limit: RTN_PAGE_SIZE,
      offset,
    });

    items.push(...page.items);

    if (!page.has_more) {
      return items;
    }

    offset += RTN_PAGE_SIZE;
  }
}

/** Добавляет все разъяснения и индексируемые страницы каталога РТН. */
export async function loadRtnSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const items = await loadAllRtnClarifications();
    const details: MetadataRoute.Sitemap = items.map((item) => ({
      url: `${SITE_URL}/rtn/${item.slug}`,
      lastModified: item.published_at
        ? new Date(item.published_at)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    const pages = createSitemapPages(
      "/rtn",
      items.length,
      RTN_PAGE_SIZE,
      RTN_MAX_PAGE,
    );

    return [...pages, ...details];
  } catch {
    return [];
  }
}
