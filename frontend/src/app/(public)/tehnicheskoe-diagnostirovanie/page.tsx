import { TECH_DIAG_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { TECH_DIAG_PAGE_SEO } from "../../seo/services/tech-diag";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { TechDiagPageContent } from "../../ui/pages/tech-diag-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(TECH_DIAG_PAGE_SEO);

/** Загружает публичную страницу технического диагностирования. */
export default async function TechDiagPage() {
  const news = await loadServiceNews("TECH_DIAG");

  return (
    <>
      <TechDiagPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={TECH_DIAG_PAGE_SEO}
        faq={TECH_DIAG_FAQ}
      />
    </>
  );
}
