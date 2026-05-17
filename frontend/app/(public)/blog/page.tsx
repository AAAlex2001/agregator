import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { fetchArticleList } from "@/source/entities/article";
import { ArticlesList } from "@/source/features/articles-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Блог платформы — обновления и советы по экспертизе ОПО",
  description:
    "Развитие тендерной платформы Ресурс-Плюс: новые функции, кейсы заказчиков и экспертов, инструкции по работе с заказами на экспертизу промышленной безопасности.",
  keywords: [
    "блог Ресурс-Плюс",
    "обновления платформы экспертизы",
    "как разместить заказ на экспертизу",
    "как выбрать эксперта Ростехнадзора",
    "кейсы экспертизы промышленной безопасности",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Блог платформы | Ресурс-Плюс",
    description: "Обновления платформы и советы по работе с экспертизой промышленной безопасности.",
    type: "website",
    url: "/blog",
    images: [{ url: "/hero_svg.webp", width: 1200, height: 630, alt: "Блог Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог платформы | Ресурс-Плюс",
    description: "Обновления платформы и советы по работе с экспертизой.",
    images: ["/hero_svg.webp"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default async function BlogListPage() {
  const [initial, crossNews] = await Promise.all([
    fetchArticleList({ kind: "blog", limit: 12, offset: 0 }, { server: true }),
    fetchArticleList({ kind: "news", limit: 3, offset: 0 }, { server: true }),
  ]);
  return (
    <>
      <LandingHeader />
      <ArticlesList
        kind="blog"
        title="Блог платформы"
        subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой промышленной безопасности"
        initial={initial}
        cross={{
          title: "Свежие новости отрасли",
          href: "/news",
          hrefLabel: "Все новости",
          items: crossNews.items,
        }}
      />
      <LandingFooter variant="light" />
    </>
  );
}
