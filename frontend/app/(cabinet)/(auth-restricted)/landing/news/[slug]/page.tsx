import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchReactions, fetchComments, ArticleJsonLd, fetchArticleBySlug, fetchRelatedArticles } from "@/source/entities/article";
import { ArticleWidget, ScrollToTopOnSlug } from "@/source/widgets/articles";

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
  const [related, reactions, comments] = await Promise.all([
    fetchRelatedArticles(slug, 10, { server: true }),
    fetchReactions(article.id, { server: true }).catch(() => undefined),
    fetchComments(article.id, { server: true }).catch(() => []),
  ]);

  return (
    <>
      <ScrollToTopOnSlug slug={article.slug} />
      <ArticleJsonLd article={article} reactions={reactions} commentCount={comments.length} />
      <ArticleWidget
        article={article}
        related={related}
        homeHref="/landing"
        sectionHrefPrefix="/landing"
        initialReactions={reactions}
        initialComments={comments}
      />
    </>
  );
}
