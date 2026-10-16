import type { Article, ArticleReactions } from "@/entities/article";
import { SITE_URL } from "@/shared/config/site";
import { extractArticleFaq } from "../../../seo/article-faq";
import { JsonLd } from "../json-ld";

/** Статья и публичная статистика для поисковой разметки. */
interface ArticleJsonLdProps {
  article: Article;
  reactions?: ArticleReactions;
  commentCount: number;
}

/** Превращает путь изображения в абсолютный адрес сайта. */
function absoluteImageUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Добавляет разметку статьи, хлебных крошек и вопросов с ответами из её текста. */
export function ArticleJsonLd({
  article,
  reactions,
  commentCount,
}: ArticleJsonLdProps) {
  const isNews = article.kind === "news";
  const section = isNews ? "/news" : "/blog";
  const sectionName = isNews ? "Новости" : "Блог";
  const pageUrl = `${SITE_URL}${section}/${article.slug}`;
  const image = absoluteImageUrl(article.cover_image || "/og-default.png");
  const faqEntries = extractArticleFaq(article.content_html);

  const articleData = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: [image],
    datePublished: article.published_at || article.updated_at,
    dateModified: article.updated_at,
    inLanguage: "ru-RU",
    keywords: article.meta_keywords || article.tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Ресурс-Плюс",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-default.png`,
      },
    },
    articleSection: sectionName,
    commentCount,
    interactionStatistic: reactions && [
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
        userInteractionCount: commentCount,
      },
    ],
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
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
        name: sectionName,
        item: `${SITE_URL}${section}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd json={JSON.stringify(articleData)} />
      <JsonLd json={JSON.stringify(breadcrumbs)} />
      {faqEntries.length > 0 && (
        <JsonLd json={JSON.stringify(faq)} />
      )}
    </>
  );
}
