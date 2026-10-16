import type { Metadata } from "next";
import type { Post } from "@/entities/post";
import { createPrivateMetadata } from "./private-page";

/** Метаданные страницы публикации: заголовок, описание и обложку готовит сервер. */
export function createPostMetadata(post: Post | null): Metadata {
  if (!post || post.status !== "published") {
    return createPrivateMetadata("Публикация");
  }

  const url = `/posts/${post.id}`;
  const image = post.cover_url ?? "/og-default.png";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: !post.repost_of,
      follow: true,
    },
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
