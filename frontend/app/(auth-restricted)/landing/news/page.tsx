import { Suspense } from "react";
import type { Metadata } from "next";
import {
  applyArticleMetrics,
  fetchArticleList,
  fetchStaticNewsMetrics,
} from "@/source/entities/article";
import { getStaticNewsListItems } from "@/source/entities/static-news";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости промышленной безопасности",
  robots: { index: false, follow: false },
};

const STATIC_PAGE_SIZE = 24;

async function AuthedNewsListContent({ page }: { page: number }) {
  const staticAll = getStaticNewsListItems();
  const staticItemsSource = staticAll.slice(0, page * STATIC_PAGE_SIZE);
  const [initial, crossBlog, staticMetrics] = await Promise.all([
    fetchArticleList({ kind: "news", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "blog", limit: 10, offset: 0 }, { server: true }),
    fetchStaticNewsMetrics(staticItemsSource.map((item) => item.id), { server: true }),
  ]);
  const staticItems = applyArticleMetrics(staticItemsSource, staticMetrics);
  return (
    <ArticlesList
      key={page}
      kind="news"
      title="Новости отрасли"
      subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
      initial={initial}
      staticItems={staticItems}
      homeHref="/landing"
      nextPageHref={
        staticItemsSource.length < staticAll.length ? `/landing/news?page=${page + 1}` : undefined
      }
      cross={{
        title: "Читайте также из блога",
        href: "/landing/blog",
        hrefLabel: "Все статьи",
        items: crossBlog.items,
      }}
    />
  );
}

export default async function AuthedNewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  return (
    <Suspense fallback={<ArticlesListSkeleton />}>
      <AuthedNewsListContent page={page} />
    </Suspense>
  );
}
