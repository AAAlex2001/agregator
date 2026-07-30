import { SITE_URL } from "@/source/shared/api/config";
import type { ServiceLandingFaqItem } from "./ServiceLandingFaq";

type ServiceLandingSchemaProps = {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  faq: ServiceLandingFaqItem[];
};

export function ServiceLandingSchema({
  name,
  description,
  path,
  serviceType,
  faq,
}: ServiceLandingSchemaProps) {
  const url = `${SITE_URL}${path}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType,
    description,
    url,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Россия" },
    inLanguage: "ru-RU",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: serviceType, item: url },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      {[service, breadcrumb, faqPage].map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
