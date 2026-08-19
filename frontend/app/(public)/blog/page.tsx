import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог платформы — обновления и советы по экспертизе ОПО",
  description:
    "Развитие тендерной платформы Ресурс-Плюс: новые функции, кейсы заказчиков и исполнителей, инструкции по работе с заказами на экспертизу промышленной безопасности.",
  keywords: [
    "блог Ресурс-Плюс",
    "обновления платформы экспертизы",
    "как разместить заказ на экспертизу",
    "как выбрать исполнителя Ростехнадзора",
    "кейсы экспертизы промышленной безопасности",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Блог платформы | Ресурс-Плюс",
    description: "Обновления платформы и советы по работе с экспертизой промышленной безопасности.",
    type: "website",
    url: "/blog",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог платформы | Ресурс-Плюс",
    description: "Обновления платформы и советы по работе с экспертизой.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const PAGE_SIZE = 12;
const MAX_LINKED_PAGE = 4;

async function BlogListContent({ page }: { page: number }) {
  const [initial, crossNews] = await Promise.all([
    fetchArticleList({ kind: "blog", limit: PAGE_SIZE * page, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "news", limit: 10, offset: 0 }, { server: true }),
  ]);
  return (
    <ArticlesList
      key={page}
      kind="blog"
      title="Блог платформы"
      subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой промышленной безопасности"
      initial={initial}
      nextPageHref={
        initial.has_more && page < MAX_LINKED_PAGE ? `/blog?page=${page + 1}` : undefined
      }
      cross={{
        title: "Свежие новости отрасли",
        href: "/news",
        hrefLabel: "Все новости",
        items: crossNews.items,
      }}
    />
  );
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.min(Math.max(1, Number(params.page) || 1), MAX_LINKED_PAGE);
  return (
    <>
      <RedirectIfAuthed to="/landing/blog" />
      <LandingHeader />
      <main>
        <Suspense fallback={<ArticlesListSkeleton />}>
          <BlogListContent page={page} />
        </Suspense>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
