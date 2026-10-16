import { ECOLOGY_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { ECOLOGY_PAGE_SEO } from "../../seo/services/ecology";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { EcologyPageContent } from "../../ui/pages/ecology-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(ECOLOGY_PAGE_SEO);

/** Загружает публичную страницу экологического сопровождения. */
export default async function EcologyPage() {
  const news = await loadServiceNews("ECOLOGY");

  return (
    <>
      <EcologyPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={ECOLOGY_PAGE_SEO}
        faq={ECOLOGY_FAQ}
      />
    </>
  );
}
