import { SITE_URL } from "@/source/shared/api/config";
import { postImage, postUrl } from "../lib/postSeo";
import type { Post } from "../model/types";

interface PostJsonLdProps {
  post: Post;
}

/** Разметка для поисковиков: опубликованный оригинал как публикация в соцсети. */
export function PostJsonLd({ post }: PostJsonLdProps) {
  if (post.status !== "published" || post.repost_of) {
    return null;
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${postImage(post)}`,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    url: postUrl(post.id),
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${SITE_URL}/posts?author=${post.author.id}`,
    },
  };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
