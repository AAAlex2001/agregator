import { SITE_URL } from "@/source/shared/api/config";
import { postSeo } from "../lib/postSeo";
import type { Post } from "../model/types";

interface PostJsonLdProps {
  post: Post;
}

/** Разметка для поисковиков: опубликованный оригинал как публикация в соцсети с автором и реакциями. */
export function PostJsonLd({ post }: PostJsonLdProps) {
  if (post.status !== "published" || post.repost_of) return null;

  const seo = postSeo(post);
  const data = {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    headline: seo.title,
    articleBody: post.excerpt,
    image: seo.images,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    inLanguage: "ru-RU",
    url: seo.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
    author: { "@type": "Person", name: seo.author, url: seo.authorUrl },
    publisher: { "@type": "Organization", name: "Ресурс-Плюс", url: SITE_URL, logo: `${SITE_URL}/og-default.png` },
    interactionStatistic: [
      { "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: post.likes_count },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.comments_count,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
