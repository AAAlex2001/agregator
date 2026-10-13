import type { Metadata } from "next";
import { SITE_URL } from "@/source/shared/api/config";
import type { Post } from "../model/types";

/** Адрес публикации на сайте. */
export function postUrl(id: number): string {
  return `${SITE_URL}/posts/${id}`;
}

/** Заголовок, описание, автор и фото публикации для поисковиков и превью ссылок. */
export function postSeo(post: Post) {
  const author = post.author.name || "Участник Ресурс-Плюс";
  const photos = post.media.filter((media) => media.kind === "photo").map((media) => `${SITE_URL}${media.url}`);
  return {
    title: post.excerpt.slice(0, 80) || `Публикация: ${author}`,
    description: post.excerpt.slice(0, 160) || `Фото и видео автора ${author} на Ресурс-Плюс.`,
    author,
    authorUrl: `${SITE_URL}/posts?author=${post.author.id}`,
    url: postUrl(post.id),
    images: photos.length ? photos : [`${SITE_URL}/og-default.png`],
  };
}

/** Метаданные страницы публикации. В поиск попадают только опубликованные оригиналы. */
export function postMetadata(post: Post | null): Metadata {
  if (!post || post.status !== "published") {
    return { title: "Публикация", robots: { index: false, follow: false } };
  }
  const seo = postSeo(post);
  const canonical = post.repost_of && !post.excerpt ? postUrl(post.repost_of.id) : seo.url;
  return {
    title: seo.title,
    description: seo.description,
    authors: [{ name: seo.author, url: seo.authorUrl }],
    alternates: { canonical },
    robots: { index: !post.repost_of, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      url: seo.url,
      images: seo.images,
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
      authors: [seo.authorUrl],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: seo.images },
  };
}
