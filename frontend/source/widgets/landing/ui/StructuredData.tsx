import { SITE_URL } from "@/source/shared/api/config";
import type { LandingFaqItem } from "../model/landing.data";

interface Props {
  faq?: LandingFaqItem[];
}

export default function StructuredData({ faq = [] }: Props) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Ресурс-Плюс",
    url: SITE_URL,
    logo: `${SITE_URL}/hero_svg.webp`,
    description:
      "Тендерная платформа для заказа экспертизы промышленной безопасности опасных производственных объектов. Аттестованные эксперты Ростехнадзора.",
    sameAs: [],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Ресурс-Плюс",
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
    name: "Экспертиза промышленной безопасности ОПО",
    serviceType: "Экспертиза промышленной безопасности",
    description:
      "Проведение экспертизы промышленной безопасности зданий, сооружений, технических устройств и документации опасных производственных объектов через тендерную платформу с аттестованными экспертами Ростехнадзора.",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Россия" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Промышленные предприятия, операторы ОПО",
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
