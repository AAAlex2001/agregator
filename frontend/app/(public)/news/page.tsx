import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList, ArticlesListSkeleton } from "@/source/features/articles-list";
import { RedirectIfAuthed } from "@/source/features/session";

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
    images: [{ url: "/hero_svg.webp", width: 1200, height: 630, alt: "Новости промышленной безопасности" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Новости промышленной безопасности",
    description: "Актуальные новости отрасли и требований Ростехнадзора.",
    images: ["/hero_svg.webp"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

async function NewsListContent() {
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
      cross={{
        title: "Читайте также из блога",
        href: "/blog",
        hrefLabel: "Все статьи",
        items: crossBlog.items,
      }}
    />
  );
}

export default function NewsListPage() {
  return (
    <>
      <RedirectIfAuthed to="/landing/news" />
      <LandingHeader />
      <main>
        <Suspense fallback={<ArticlesListSkeleton />}>
          <NewsListContent />
        </Suspense>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
