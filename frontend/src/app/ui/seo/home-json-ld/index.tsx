import type { LandingFaqItem } from "@/entities/landing-content";
import { SITE_URL } from "@/shared/config/site";
import { HOME_PAGE_SEO } from "../../../seo/home";
import { JsonLd } from "../json-ld";

/** Вопросы главной страницы, включённые в серверную разметку FAQ. */
interface HomeJsonLdProps {
  faq: LandingFaqItem[];
}

/** Описывает организацию, сайт, услуги и FAQ для поисковых систем. */
export function HomeJsonLd({ faq }: HomeJsonLdProps) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Ресурс-Плюс",
    url: SITE_URL,
    logo: `${SITE_URL}/og-default.png`,
    description: HOME_PAGE_SEO.description,
    sameAs: [],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Ресурс-Плюс",
    description: HOME_PAGE_SEO.description,
    inLanguage: "ru-RU",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/orders?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: HOME_PAGE_SEO.title,
    serviceType: "Промышленные и инженерные услуги",
    description: HOME_PAGE_SEO.description,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Специалисты и промышленные предприятия",
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
      <JsonLd json={JSON.stringify(organization)} />
      <JsonLd json={JSON.stringify(website)} />
      <JsonLd json={JSON.stringify(service)} />
      {faq.length > 0 && <JsonLd json={JSON.stringify(faqPage)} />}
    </>
  );
}
