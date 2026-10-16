import type { Metadata } from "next";
import type { Article, ArticleKind } from "@/entities/article";
import { createPrivateMetadata } from "./private-page";

/** Задаёт заголовок кабинетной версии статьи и запрещает её индексацию. */
export function createPrivateArticleMetadata(
  kind: ArticleKind,
  article: Article | null,
): Metadata {
  const missingTitle = kind === "news" ? "Новость не найдена" : "Статья не найдена";
  const title = article && article.kind === kind
    ? article.meta_title || article.title
    : missingTitle;

  return createPrivateMetadata(title);
}

/** Сохраняет метаданные статьи и исключает отсутствующую страницу из индексации. */
export function createArticleMetadata(
  kind: ArticleKind,
  article: Article | null,
): Metadata {
  if (!article || article.kind !== kind) {
    return createPrivateMetadata(kind === "news" ? "Новость не найдена" : "Статья не найдена");
  }

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || article.title;
  const image = kind === "news"
    ? article.og_image || article.cover_image || "/og-default.png"
    : article.cover_image || "/og-default.png";
  const canonical = `/${kind}/${article.slug}`;

  return {
    title,
    description,
    keywords: article.meta_keywords || article.tags.join(", "),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      images: [
        {
          url: image,
          alt: article.title,
        },
      ],
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
