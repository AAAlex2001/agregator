import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости промышленной безопасности",
  robots: { index: false, follow: false },
};

async function AuthedNewsListContent() {
  const [initial, crossBlog] = await Promise.all([
    fetchArticleList({ kind: "news", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "blog", limit: 10, offset: 0 }, { server: true }),
  ]);
  return (
    <ArticlesList
      kind="news"
      title="Новости отрасли"
      subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
      initial={initial}
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
