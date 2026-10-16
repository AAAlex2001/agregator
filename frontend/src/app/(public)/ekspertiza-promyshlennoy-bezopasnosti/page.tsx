import { getLandingContent } from "@/entities/landing-content/server";
import { EXPERTISE_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { EXPERTISE_PAGE_SEO } from "../../seo/services/expertise";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { ExpertisePageContent } from "../../ui/pages/expertise-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(EXPERTISE_PAGE_SEO);

/** Загружает публичную страницу экспертизы промышленной безопасности. */
export default async function ExpertisePage() {
  const [content, news] = await Promise.all([
    getLandingContent(),
    loadServiceNews("EXPERTISE"),
  ]);

  return (
    <>
      <ExpertisePageContent
        content={content}
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={EXPERTISE_PAGE_SEO}
        faq={EXPERTISE_FAQ}
      />
    </>
  );
}
