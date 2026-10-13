import { SITE_URL } from "@/source/shared/api/config";
import { postImage, postUrl } from "../lib/postSeo";
import type { Post } from "../model/types";
import { breadcrumbs, JsonLd } from "./JsonLd";

interface PostJsonLdProps {
  post: Post;
}

/** Разметка для поисковиков: опубликованный оригинал как публикация в соцсети. */
export function PostJsonLd({ post }: PostJsonLdProps) {
  if (post.status !== "published" || post.repost_of) {
    return null;
  }

  const url = postUrl(post.id);
  const posting = {
    "@type": "SocialMediaPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${postImage(post)}`,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    url,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${SITE_URL}/posts?author=${post.author.id}`,
    },
    commentCount: post.comments_count,
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.likes_count,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.comments_count,
      },
    ],
  };
  const crumbs = breadcrumbs({ name: `Публикация #${post.id}`, url });

  return <JsonLd graph={[posting, crumbs]} />;
}
