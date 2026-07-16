import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/source/entities/article";
import { fetchReactions } from "@/source/entities/article-reaction";
import { fetchComments } from "@/source/entities/article-comment";
import { ArticleJsonLd, ArticleView, ScrollToTopOnSlug } from "@/source/features/article-view";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "blog") {
    return { title: "Статья не найдена", robots: { index: false, follow: false } };
  }
  return {
    title: article.meta_title || article.title,
    robots: { index: false, follow: false },
  };
}

export default async function AuthedBlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "blog") notFound();
  const [related, reactions, comments] = await Promise.all([
    fetchRelatedArticles(slug, { limit: 10, server: true }),
    fetchReactions(article.id, { server: true }).catch(() => undefined),
    fetchComments(article.id, { server: true }).catch(() => []),
  ]);

  return (
    <>
      <ScrollToTopOnSlug slug={article.slug} />
      <ArticleJsonLd article={article} reactions={reactions} commentCount={comments.length} />
      <ArticleView
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
