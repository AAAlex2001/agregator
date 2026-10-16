import type { Post } from "@/entities/post";
import { SITE_URL } from "@/shared/config/site";
import { JsonLd } from "../json-ld";

/** Публикация для поисковой разметки. */
interface PostJsonLdProps {
  post: Post;
}

/** Добавляет опубликованный оригинал как запись в соцсети и хлебные крошки раздела. */
export function PostJsonLd({ post }: PostJsonLdProps) {
  if (post.status !== "published" || post.repost_of) {
    return null;
  }

  const url = `${SITE_URL}/posts/${post.id}`;
  const title = `Публикация #${post.id}`;

  const posting = {
    "@type": "SocialMediaPosting",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${post.cover_url ?? "/og-default.png"}`,
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
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Публикации",
        item: `${SITE_URL}/posts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: url,
      },
    ],
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [posting, breadcrumbs],
  };

  return <JsonLd json={JSON.stringify(data)} />;
}
