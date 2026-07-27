import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
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
import { RedirectIfAuthed } from "@/source/features/session";

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
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || article.title;
  const ogImage = article.cover_image || "/og-default.png";

  return {
    title,
    description,
    keywords: article.meta_keywords || article.tags.join(", "),
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/news/${article.slug}`,
      images: [{ url: ogImage, alt: article.title }],
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      tags: article.tags,
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function NewsArticlePage({ params }: Props) {
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
      <RedirectIfAuthed to={`/landing/news/${slug}`} />
      <LandingHeader />
      <ScrollToTopOnSlug slug={article.slug} />
      <ArticleJsonLd article={article} reactions={reactions} commentCount={comments.length} />
      <main>
        <ArticleView
          article={article}
          related={related}
          initialReactions={reactions}
          initialComments={comments}
          interactive
          discussionEnabled={!staticArticle}
        />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
