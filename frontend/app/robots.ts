import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";

export const dynamic = "force-static";

const INDEXABLE_PATHS: string[] = [
  "/",
  "/orders",
  "/reviews",
  "/news",
  "/blog",
  "/zepb-registry",
  "/login",
  "/register",
  "/forgot-password",
  "/requisites",
  "/offer",
  "/user-agreement",
  "/privacy-policy",
];

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
