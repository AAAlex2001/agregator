import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог платформы",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 12;
const MAX_LINKED_PAGE = 4;
const CROSS_NEWS_COUNT = 10;

async function AuthedBlogListContent({ page }: { page: number }) {
  const [initial, crossNews] = await Promise.all([
    fetchArticleList({ kind: "blog", limit: PAGE_SIZE * page, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "news", limit: CROSS_NEWS_COUNT, offset: 0 }, { server: true }),
  ]);

  return (
    <ArticlesList
      key={page}
      kind="blog"
      title="Блог платформы"
      subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой промышленной безопасности"
      initial={initial}
      homeHref="/landing"
      nextPageHref={
        initial.has_more && page < MAX_LINKED_PAGE ? `/landing/blog?page=${page + 1}` : undefined
      }
      cross={{
        title: "Свежие новости отрасли",
        href: "/landing/news",
        hrefLabel: "Все новости",
        items: crossNews.items,
      }}
    />
  );
}

export default async function AuthedBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.min(Math.max(1, Number(params.page) || 1), MAX_LINKED_PAGE);
  return (
    <Suspense fallback={<ArticlesListSkeleton />}>
      <AuthedBlogListContent page={page} />
    </Suspense>
  );
}
