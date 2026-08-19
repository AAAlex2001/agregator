import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import {
  applyArticleMetrics,
  fetchArticleList,
  fetchStaticNewsMetrics,
} from "@/source/entities/article";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";
import { RedirectIfAuthed } from "@/source/features/session";
import { getStaticNewsListItems } from "@/source/entities/static-news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Новости промышленной безопасности",
  description:
    "Актуальные новости горной, нефтегазовой, химической и других отраслей промышленности. Изменения в законодательстве, требования Ростехнадзора, обзоры аварий и инцидентов на ОПО.",
  keywords: [
    "новости промышленной безопасности",
    "новости Ростехнадзора",
    "новости горной отрасли",
    "новости нефтегазовой отрасли",
    "новости ОПО",
    "новости экспертизы промышленной безопасности",
  ],
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Новости промышленной безопасности | Ресурс-Плюс",
    description:
      "Актуальные новости горной, нефтегазовой и других отраслей промышленности.",
    type: "website",
    url: "/news",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Новости промышленной безопасности",
    description: "Актуальные новости отрасли и требований Ростехнадзора.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const STATIC_PAGE_SIZE = 24;

async function NewsListContent({ page }: { page: number }) {
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
      nextPageHref={staticItemsSource.length < staticAll.length ? `/news?page=${page + 1}` : undefined}
      cross={{
        title: "Читайте также из блога",
        href: "/blog",
        hrefLabel: "Все статьи",
        items: crossBlog.items,
      }}
    />
  );
}

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  return (
    <>
      <RedirectIfAuthed to="/landing/news" />
      <LandingHeader />
      <main>
        <Suspense fallback={<ArticlesListSkeleton />}>
          <NewsListContent page={page} />
        </Suspense>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
