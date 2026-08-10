import { fetchArticleList } from "@/source/entities/article";
import { fetchPricingPlans } from "@/source/features/pricing/subscribe";
import { loadLandingSnapshot } from "./landing.data";

/** Единый загрузчик данных главного лендинга — используется и публичной, и авторизованной страницей. */
export async function loadLandingPageData() {
  const [snapshot, pricingPlans, newsPage, blogPage] = await Promise.all([
    loadLandingSnapshot(),
    fetchPricingPlans(),
    fetchArticleList({ kind: "news", limit: 10, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "blog", limit: 10, offset: 0 }, { server: true }),
  ]);

  return { snapshot, pricingPlans, newsPage, blogPage };
}

export type LandingPageData = Awaited<ReturnType<typeof loadLandingPageData>>;
