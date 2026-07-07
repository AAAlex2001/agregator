import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/source/entities/article";
import { ArticleView, ScrollToTopOnSlug } from "@/source/features/article-view";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "news") {
    return { title: "Новость не найдена", robots: { index: false, follow: false } };
  }
  return {
    title: article.meta_title || article.title,
    robots: { index: false, follow: false },
  };
}

export default async function AuthedNewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "news") notFound();
  const related = await fetchRelatedArticles(slug, { limit: 10, server: true });

  return (
    <>
      <ScrollToTopOnSlug slug={article.slug} />
      <ArticleView
        article={article}
        related={related}
        homeHref="/landing"
        sectionHrefPrefix="/landing"
      />
    </>
  );
}
