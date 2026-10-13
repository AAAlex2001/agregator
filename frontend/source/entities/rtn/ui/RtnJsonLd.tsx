import { SITE_URL } from "@/source/shared/api/config";
import type { RtnDetail } from "../model/clarification";

const PUBLISHER = {
  "@type": "Organization",
  name: "Ресурс-Плюс",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 },
};

interface RtnJsonLdProps {
  clarification: RtnDetail;
  commentCount: number;
}

/** Разметка для поисковиков: вопрос с принятым ответом, статья и хлебные крошки. */
export function RtnJsonLd({ clarification, commentCount }: RtnJsonLdProps) {
  const pageUrl = `${SITE_URL}/rtn/${clarification.slug}`;
  const published = clarification.published_at || clarification.updated_at;

  const question = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: clarification.title,
      text: clarification.question_text || clarification.excerpt,
      answerCount: 1,
      dateCreated: published,
      commentCount,
      acceptedAnswer: {
        "@type": "Answer",
        text: clarification.answer_html,
        dateCreated: published,
        url: pageUrl,
        author: { "@type": "Organization", name: clarification.department || "Ростехнадзор" },
      },
    },
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: clarification.title,
    description: clarification.excerpt || clarification.meta_description || clarification.title,
    articleSection: "Ростехнадзор отвечает",
    inLanguage: "ru-RU",
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    datePublished: published,
    dateModified: clarification.updated_at,
    keywords: clarification.tags.join(", "),
    image: `${SITE_URL}/og-default.png`,
    author: PUBLISHER,
    publisher: PUBLISHER,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Ростехнадзор отвечает", item: `${SITE_URL}/rtn` },
      { "@type": "ListItem", position: 3, name: clarification.title, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(question) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
