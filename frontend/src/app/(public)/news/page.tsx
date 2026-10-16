import { Suspense } from "react";
import { ArticlesPageSkeleton } from "@/widgets/articles";
import { NEWS_LIST_METADATA } from "../../seo/news-list";
import { NewsListPageContent } from "../../ui/pages/news-list-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";
export const metadata = NEWS_LIST_METADATA;

/** Параметр серверной страницы списка новостей. */
interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

/** Открывает публичные новости с серверной пагинацией и прежними метаданными. */
export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  return (
    <PublicSiteShell redirectTo="/landing/news">
      <main>
        <Suspense fallback={<ArticlesPageSkeleton />}>
          <NewsListPageContent page={page} />
        </Suspense>
      </main>
    </PublicSiteShell>
  );
}
