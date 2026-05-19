import type { Metadata } from "next";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог платформы",
  robots: { index: false, follow: false },
};

export default async function AuthedBlogListPage() {
  const [initial, crossNews] = await Promise.all([
    fetchArticleList({ kind: "blog", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "news", limit: 3, offset: 0 }, { server: true }),
  ]);
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
        items: crossNews.items,
      }}
    />
  );
}
