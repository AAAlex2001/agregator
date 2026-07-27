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

async function AuthedNewsListContent() {
  const staticItemsSource = getStaticNewsListItems();
  const [initial, crossBlog, staticMetrics] = await Promise.all([
    fetchArticleList({ kind: "news", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "blog", limit: 10, offset: 0 }, { server: true }),
    fetchStaticNewsMetrics(staticItemsSource.map((item) => item.id), { server: true }),
  ]);
  const staticItems = applyArticleMetrics(staticItemsSource, staticMetrics);
  return (
    <ArticlesList
      kind="news"
      title="Новости отрасли"
      subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
      initial={initial}
      staticItems={staticItems}
      homeHref="/landing"
      cross={{
        title: "Читайте также из блога",
        href: "/landing/blog",
        hrefLabel: "Все статьи",
        items: crossBlog.items,
      }}
    />
  );
}

export default function AuthedNewsListPage() {
  return (
    <Suspense fallback={<ArticlesListSkeleton />}>
      <AuthedNewsListContent />
    </Suspense>
  );
}
