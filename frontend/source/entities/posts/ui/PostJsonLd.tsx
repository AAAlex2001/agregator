import { SITE_URL } from "@/source/shared/api/config";
import { postSeo } from "../lib/postSeo";
import type { Post } from "../model/types";

/** Описывает опубликованный оригинал как статью сообщества. */
export function PostJsonLd({ post }: { post: Post }) {
  if (post.status !== "published" || post.repost_of) return null;

  const seo = postSeo(post);
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seo.title,
    description: seo.description,
    image: seo.images,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    inLanguage: "ru-RU",
    url: seo.url,
    mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
    author: { "@type": "Person", name: seo.author, url: seo.authorUrl },
    publisher: {
      "@type": "Organization",
      name: "Ресурс-Плюс",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og-default.png` },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
