import { SITE_URL } from "@/source/shared/api/config";
import type { ArticleDetail } from "@/source/entities/article";
import type { ReactionState } from "@/source/entities/article-reaction";

interface Props {
  article: ArticleDetail;
  reactions?: ReactionState;
  commentCount?: number;
}

function absoluteUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function ArticleJsonLd({ article, reactions, commentCount }: Props) {
  const isNews = article.kind === "news";
  const pageUrl = `${SITE_URL}${isNews ? "/news/" : "/blog/"}${article.slug}`;
  const image = absoluteUrl(article.cover_image || "/hero_svg.webp");

  const interactionStatistic = reactions
    ? [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: reactions.likes_count,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/DislikeAction",
          userInteractionCount: reactions.dislikes_count,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/CommentAction",
          userInteractionCount: commentCount ?? 0,
        },
      ]
    : undefined;

  const data = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: image ? [image] : undefined,
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    inLanguage: "ru-RU",
    keywords: article.meta_keywords || article.tags.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    publisher: {
      "@type": "Organization",
      name: "Ресурс-Плюс",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/hero_svg.webp` },
    },
    articleSection: isNews ? "Новости" : "Блог",
    commentCount: commentCount ?? undefined,
    interactionStatistic,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: isNews ? "Новости" : "Блог", item: `${SITE_URL}${isNews ? "/news" : "/blog"}` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
