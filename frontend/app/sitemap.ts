import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";

export const dynamic = "force-dynamic";

const INDEXABLE_PATHS = ["/", "/login", "/register", "/forgot-password", "/requisites"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}