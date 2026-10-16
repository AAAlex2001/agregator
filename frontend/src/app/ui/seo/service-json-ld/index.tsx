import type { LandingFaqItem } from "@/entities/landing-content";
import { SITE_URL } from "@/shared/config/site";
import type { ServicePageSeo } from "../../../seo/services/types";
import { JsonLd } from "../json-ld";

/** Описание публичной услуги и вопросы, показанные на её странице. */
interface ServiceJsonLdProps {
  service: ServicePageSeo;
  faq: LandingFaqItem[];
}

/** Добавляет структурированные данные услуги, навигационной цепочки и FAQ. */
export function ServiceJsonLd({ service, faq }: ServiceJsonLdProps) {
  const url = `${SITE_URL}${service.path}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.title,
    serviceType: service.serviceType,
    description: service.description,
    url,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    inLanguage: "ru-RU",
  };
  const breadcrumb = {
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
        name: service.serviceType,
        item: url,
      },
    ],
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd json={JSON.stringify(serviceSchema)} />
      <JsonLd json={JSON.stringify(breadcrumb)} />
      <JsonLd json={JSON.stringify(faqPage)} />
    </>
  );
}
