import type { Metadata } from "next";
import { getArticleOnServer } from "@/entities/article/server";
import { ArticleDetail } from "@/widgets/articles";
import { loadArticlePage } from "../../../../../content/load-article-page";
import type { ArticlePageProps } from "../../../../../content/load-article-page";
import { createPrivateArticleMetadata } from "../../../../../seo/article";
import { ArticleJsonLd } from "../../../../../ui/seo/article-json-ld";
import { ArticleRegistrationEntry } from "../../../../../ui/article-registration";
import { ArticleScrollReset } from "../../../../../ui/article-scroll-reset";

export const dynamic = "force-dynamic";

/** Сохраняет заголовок статьи и запрет индексации её кабинетной версии. */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleOnServer(slug);

  return createPrivateArticleMetadata("blog", article);
}

/** Показывает статью внутри кабинета со ссылками на его разделы. */
export default async function PrivateBlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const {
    article,
    related,
    reactions,
    comments,
  } = await loadArticlePage(slug, "blog");

  return (
    <>
      <ArticleScrollReset slug={article.slug} />
      <ArticleJsonLd
        article={article}
        reactions={reactions}
        commentCount={comments.length}
      />
      <ArticleDetail
        key={article.id}
        article={article}
        related={related}
        homeHref="/landing"
        sectionHrefPrefix="/landing"
        initialReactions={reactions}
        initialComments={comments}
        registration={<ArticleRegistrationEntry />}
      />
    </>
  );
}
