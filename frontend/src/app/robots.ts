import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

export const dynamic = "force-static";

/** Публичные страницы, открытые поисковым роботам. */
const INDEXABLE_PATHS = [
  "/",
  "/orders",
  "/reviews",
  "/news",
  "/posts",
  "/blog",
  "/rtn",
  "/rtn/ask",
  "/zepb-registry",
  "/expert-contacts",
  "/training/defectoscopist-certification",
  "/requisites",
  "/offer",
  "/user-agreement",
  "/privacy-policy",
];

/** Служебные маршруты и страницы кабинета, закрытые от индексации. */
const DISALLOWED_PATHS = [
  "/admin",
  "/api",
  "/chat",
  "/customer",
  "/expert",
  "/order",
  "/responses",
  "/settings",
  "/landing",
  "/archive",
  "/notifications",
  "/support",
];

/** Сохраняет правила индексации сайта и адрес его карты страниц. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: INDEXABLE_PATHS,
      disallow: DISALLOWED_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
