import type { Metadata } from "next";
import { getArticleOnServer } from "@/entities/article/server";
import { ArticleDetail } from "@/widgets/articles";
import { loadArticlePage } from "../../../content/load-article-page";
import type { ArticlePageProps } from "../../../content/load-article-page";
import { createArticleMetadata } from "../../../seo/article";
import { ArticleJsonLd } from "../../../ui/seo/article-json-ld";
import { ArticleRegistrationEntry } from "../../../ui/article-registration";
import { ArticleScrollReset } from "../../../ui/article-scroll-reset";
import { PublicSiteShell } from "../../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";

/** Формирует поисковые метаданные опубликованной статьи. */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleOnServer(slug);

  return createArticleMetadata("blog", article);
}

/** Показывает публичную статью с серверным текстом и структурированной разметкой. */
export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const {
    article,
    related,
    reactions,
    comments,
  } = await loadArticlePage(slug, "blog");

  return (
    <PublicSiteShell redirectTo={`/landing/blog/${slug}`}>
      <ArticleScrollReset slug={article.slug} />
      <ArticleJsonLd
        article={article}
        reactions={reactions}
        commentCount={comments.length}
      />
      <main>
        <ArticleDetail
          key={article.id}
          article={article}
          related={related}
          initialReactions={reactions}
          initialComments={comments}
          registration={<ArticleRegistrationEntry />}
        />
      </main>
    </PublicSiteShell>
  );
}
