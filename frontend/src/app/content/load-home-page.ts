import "server-only";

import type { ArticleListItem } from "@/entities/article";
import { getArticlesOnServer } from "@/entities/article/server";
import type { LandingContent } from "@/entities/landing-content";
import { getLandingContent } from "@/entities/landing-content/server";
import type { PricingPlan } from "@/entities/pricing";
import { getPricingPlansOnServer } from "@/entities/pricing/server";

/** Данные публичной главной и её версии внутри кабинета. */
export interface HomePageData {
  content: LandingContent;
  plans: PricingPlan[];
  news: ArticleListItem[];
  blog: ArticleListItem[];
}

/** Загружает главную; недоступные тарифы скрывают только их секцию. */
export async function loadHomePage(): Promise<HomePageData> {
  const [content, plans, news, blog] = await Promise.all([
    getLandingContent(),
    getPricingPlansOnServer().catch(() => []),
    getArticlesOnServer({ kind: "news", limit: 10, offset: 0 }),
    getArticlesOnServer({ kind: "blog", limit: 10, offset: 0 }),
  ]);

  return {
    content,
    plans,
    news: news.items,
    blog: blog.items,
  };
}
