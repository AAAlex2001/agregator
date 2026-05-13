import type { MetadataRoute } from "next";
import { SITE_URL } from "@/source/shared/api/config";

export const dynamic = "force-static";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

const INDEXABLE_ROUTES: Array<{ path: string; changeFrequency: ChangeFrequency; priority: number }> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/orders", changeFrequency: "daily", priority: 0.9 },
  { path: "/reviews", changeFrequency: "weekly", priority: 0.7 },
  { path: "/register", changeFrequency: "monthly", priority: 0.7 },
  { path: "/login", changeFrequency: "monthly", priority: 0.4 },
  { path: "/forgot-password", changeFrequency: "yearly", priority: 0.3 },
  { path: "/requisites", changeFrequency: "yearly", priority: 0.3 },
  { path: "/offer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/user-agreement", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return INDEXABLE_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
