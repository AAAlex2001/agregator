import type { Metadata } from "next";
import { SITE_URL } from "@/source/shared/api/config";
import type { Post } from "../model/types";

/** Адрес публикации на сайте. */
export function postUrl(id: number): string {
  return `${SITE_URL}/posts/${id}`;
}

/** Обложка для превью ссылки: первое фото поста или общая картинка сайта. */
export function postImage(post: Post): string {
  return post.cover_url ?? "/og-default.png";
}

/** Метаданные страницы публикации. Заголовок и описание готовит бэкенд, репосты в поиск не идут. */
export function postMetadata(post: Post | null): Metadata {
  if (!post || post.status !== "published") {
    return {
      title: "Публикация",
      robots: { index: false, follow: false },
    };
  }

  const url = `/posts/${post.id}`;
  const image = postImage(post);

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    robots: { index: !post.repost_of, follow: true },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      images: [image],
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}
