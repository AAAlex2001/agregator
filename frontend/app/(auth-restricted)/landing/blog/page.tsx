import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchArticleList } from "@/source/entities/article";
import { getStaticNewsListItems } from "@/source/entities/static-news";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог платформы",
  robots: { index: false, follow: false },
};

async function AuthedBlogListContent() {
  const staticNews = getStaticNewsListItems();
  const [initial, crossNews] = await Promise.all([
    fetchArticleList({ kind: "blog", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "news", limit: 10, offset: 0 }, { server: true }),
  ]);
  const staticSlugs = new Set(staticNews.map((item) => item.slug));
  const crossNewsItems = [
    ...staticNews,
    ...crossNews.items.filter((item) => !staticSlugs.has(item.slug)),
  ].slice(0, 10);

  return (
    <ArticlesList
      kind="blog"
      title="Блог платформы"
      subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой промышленной безопасности"
      initial={initial}
      homeHref="/landing"
      cross={{
        title: "Свежие новости отрасли",
        href: "/landing/news",
        hrefLabel: "Все новости",
        items: crossNewsItems,
      }}
    />
  );
}

export default function AuthedBlogListPage() {
  return (
    <Suspense fallback={<ArticlesListSkeleton />}>
      <AuthedBlogListContent />
    </Suspense>
  );
}
