import { SITE_URL } from "@/source/shared/api/config";
import type { RtnDetail } from "@/source/entities/rtn-clarification";

interface Props {
  clarification: RtnDetail;
  commentCount?: number;
}

export function RtnJsonLd({ clarification, commentCount }: Props) {
  const pageUrl = `${SITE_URL}/rtn/${clarification.slug}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: clarification.title,
      text: clarification.question_text || clarification.excerpt,
      answerCount: 1,
      dateCreated: clarification.published_at || clarification.updated_at,
      acceptedAnswer: {
        "@type": "Answer",
        text: clarification.answer_html,
        dateCreated: clarification.published_at || clarification.updated_at,
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: clarification.department || "Ростехнадзор",
        },
      },
      commentCount: commentCount ?? undefined,
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
