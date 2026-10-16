import { FORENSIC_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { FORENSIC_PAGE_SEO } from "../../seo/services/forensic";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { ForensicPageContent } from "../../ui/pages/forensic-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(FORENSIC_PAGE_SEO);

/** Загружает публичную страницу судебной экспертизы. */
export default async function ForensicPage() {
  const news = await loadServiceNews("FORENSIC");

  return (
    <>
      <ForensicPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={FORENSIC_PAGE_SEO}
        faq={FORENSIC_FAQ}
      />
    </>
  );
}
