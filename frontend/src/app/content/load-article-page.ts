import { notFound } from "next/navigation";
import type { ArticleKind } from "@/entities/article";
import {
  getArticleOnServer,
  getArticleCommentsOnServer,
  getArticleReactionsOnServer,
  getRelatedArticlesOnServer,
} from "@/entities/article/server";

/** Параметры маршрута отдельной новости или статьи блога. */
export interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/** Загружает статью нужного раздела и дополнительные данные её страницы. */
export async function loadArticlePage(slug: string, kind: ArticleKind) {
  const article = await getArticleOnServer(slug);

  if (!article || article.kind !== kind) {
    notFound();
  }

  const [related, reactions, comments] = await Promise.all([
    getRelatedArticlesOnServer(slug, 10),
    getArticleReactionsOnServer(article.id).catch(() => undefined),
    getArticleCommentsOnServer(article.id).catch(() => []),
  ]);

  return {
    article,
    related,
    reactions,
    comments,
  };
}
