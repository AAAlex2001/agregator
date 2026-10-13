import type { Metadata } from "next";
import { SITE_URL } from "@/source/shared/api/config";
import type { Post } from "../model/types";
import { postText } from "./postText";

/** Собирает заголовок, описание и фотографии для поисковиков и ссылок. */
export function postSeo(post: Post) {
  const text = postText(post.html);
  const author = post.author.name || "Участник Ресурс-Плюс";
  const photos = post.media
    .filter((media) => media.kind === "photo")
    .map((media) => new URL(media.url, SITE_URL).href);

  return {
    title: text.slice(0, 80) || `Публикация: ${author}`,
    description: text.slice(0, 160) || `Фото и видео автора ${author} на Ресурс-Плюс.`,
    author,
    authorUrl: `${SITE_URL}/posts?author=${post.author.id}`,
    url: `${SITE_URL}/posts/${post.id}`,
    images: photos.length ? photos : [`${SITE_URL}/og-default.png`],
  };
}

/** Индексирует оригиналы; черновики и копии репостов исключает из поиска. */
export function postMetadata(post: Post | null | undefined): Metadata {
  if (!post || post.status !== "published") {
    return { title: "Публикация", robots: { index: false, follow: false } };
  }

  const seo = postSeo(post);
  const originalUrl = post.repost_of && !postText(post.html)
    ? `${SITE_URL}/posts/${post.repost_of.id}`
    : seo.url;

  return {
    title: seo.title,
    description: seo.description,
    authors: [{ name: seo.author, url: seo.authorUrl }],
    alternates: { canonical: originalUrl },
    robots: { index: !post.repost_of, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "article",
      url: seo.url,
      images: seo.images,
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [seo.authorUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.images,
    },
  };
}
