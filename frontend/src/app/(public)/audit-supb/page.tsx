import { AUDIT_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { AUDIT_PAGE_SEO } from "../../seo/services/audit";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { AuditPageContent } from "../../ui/pages/audit-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(AUDIT_PAGE_SEO);

/** Загружает публичную страницу аудита СУПБ. */
export default async function AuditPage() {
  const news = await loadServiceNews("AUDIT_SUPB");

  return (
    <>
      <AuditPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={AUDIT_PAGE_SEO}
        faq={AUDIT_FAQ}
      />
    </>
  );
}
