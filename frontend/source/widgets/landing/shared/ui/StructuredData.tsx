import { MAIN_PAGE_TITLE, MAIN_PAGE_DESCRIPTION } from "@/source/shared/config/mainPageContent";
import { SITE_URL } from "@/source/shared/api/config";
import type { ServiceLandingFaqItem } from "./ServiceLandingFaq";

interface Props {
  faq?: ServiceLandingFaqItem[];
}

export default function StructuredData({ faq = [] }: Props) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Ресурс-Плюс",
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.png`,
    description: MAIN_PAGE_DESCRIPTION,
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Ресурс-Плюс",
    description: MAIN_PAGE_DESCRIPTION,
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/orders?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: MAIN_PAGE_TITLE,
    serviceType: "Промышленные и инженерные услуги",
    description: MAIN_PAGE_DESCRIPTION,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Россия" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Специалисты и промышленные предприятия",
    },
  };

  const faqPage = faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const blocks = [organization, website, service, faqPage].filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
