import type { Metadata } from "next";

/** Описание ленты и ленты автора для поисковиков и превью ссылки. */
const POSTS_FEED_DESCRIPTION =
  "Опыт, новости и публикации специалистов промышленной безопасности на Ресурс-Плюс.";

/** Метаданные ленты: «Показать ещё» дополняет первую страницу, поэтому адрес без номера. */
export function createPostsFeedMetadata(title: string, path: string): Metadata {
  return {
    title,
    description: POSTS_FEED_DESCRIPTION,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title,
      description: POSTS_FEED_DESCRIPTION,
      url: path,
      images: ["/og-default.png"],
    },
  };
}
