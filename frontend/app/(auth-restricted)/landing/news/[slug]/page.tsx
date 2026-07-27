import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  applyArticleMetrics,
  fetchArticleBySlug,
  fetchRelatedArticles,
  fetchStaticNewsMetrics,
} from "@/source/entities/article";
import { fetchReactions } from "@/source/entities/article-reaction";
import { fetchComments, type ArticleComment } from "@/source/entities/article-comment";
import {
  STATIC_NEWS_SLUGS,
  getStaticNewsArticle,
  getStaticRelatedNews,
} from "@/source/entities/static-news";
import { ArticleJsonLd, ArticleView, ScrollToTopOnSlug } from "@/source/features/article-view";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return STATIC_NEWS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getStaticNewsArticle(slug) ?? await fetchArticleBySlug(slug, { server: true });
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
  const staticArticle = await getStaticNewsArticle(slug);
  const article = staticArticle ?? await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "news") notFound();
  const staticRelated = staticArticle ? getStaticRelatedNews(slug, 10) : [];
  const [relatedSource, reactions, comments, staticMetrics] = staticArticle
    ? await Promise.all([
        Promise.resolve(staticRelated),
        fetchReactions(article.id, { server: true }).catch(() => undefined),
        Promise.resolve([] as ArticleComment[]),
        fetchStaticNewsMetrics(staticRelated.map((item) => item.id), { server: true }),
      ])
    : await Promise.all([
        fetchRelatedArticles(slug, { limit: 10, server: true }),
        fetchReactions(article.id, { server: true }).catch(() => undefined),
        fetchComments(article.id, { server: true }).catch(() => []),
        Promise.resolve({}),
      ]);
  const related = applyArticleMetrics(relatedSource, staticMetrics);

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
        interactive
        discussionEnabled={!staticArticle}
      />
    </>
  );
}
