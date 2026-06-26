import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import { fetchArticleBySlug, fetchRelatedArticles } from "@/source/entities/article";
import { fetchReactions } from "@/source/entities/article-reaction";
import { fetchComments } from "@/source/entities/article-comment";
import { ArticleJsonLd, ArticleView, ScrollToTopOnSlug } from "@/source/features/article-view";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "blog") {
    return { title: "Статья не найдена", robots: { index: false, follow: false } };
  }
  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || article.title;
  const ogImage = article.og_image || article.cover_image || "/hero_svg.webp";

  return {
    title,
    description,
    keywords: article.meta_keywords || article.tags.join(", "),
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${article.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      tags: article.tags,
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug, { server: true });
  if (!article || article.kind !== "blog") notFound();
  const [related, reactions, comments] = await Promise.all([
    fetchRelatedArticles(slug, { limit: 3, server: true }),
    fetchReactions(article.id, { server: true }).catch(() => undefined),
    fetchComments(article.id, { server: true }).catch(() => []),
  ]);

  return (
    <>
      <RedirectIfAuthed to={`/landing/blog/${slug}`} />
      <LandingHeader />
      <ScrollToTopOnSlug slug={article.slug} />
      <ArticleJsonLd article={article} reactions={reactions} commentCount={comments.length} />
      <main>
        <ArticleView
          article={article}
          related={related}
          initialReactions={reactions}
          initialComments={comments}
        />
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
