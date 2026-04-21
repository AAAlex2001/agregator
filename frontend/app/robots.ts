import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";

export const dynamic = "force-dynamic";

const INDEXABLE_PATHS: string[] = ["/", "/login", "/register", "/forgot-password"];

const DISALLOWED_PATHS = [
  "/admin",
  "/api",
  "/chat",
  "/customer",
  "/expert",
  "/order",
  "/responses",
  "/settings",
  "/requisites",
];

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