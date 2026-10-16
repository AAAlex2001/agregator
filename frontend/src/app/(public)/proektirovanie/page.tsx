import { DESIGN_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { DESIGN_PAGE_SEO } from "../../seo/services/design";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { DesignPageContent } from "../../ui/pages/design-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(DESIGN_PAGE_SEO);

/** Загружает публичную страницу проектирования. */
export default async function DesignPage() {
  const news = await loadServiceNews("DESIGN");

  return (
    <>
      <DesignPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={DESIGN_PAGE_SEO}
        faq={DESIGN_FAQ}
      />
    </>
  );
}
