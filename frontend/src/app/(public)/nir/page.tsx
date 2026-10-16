import { RESEARCH_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { RESEARCH_PAGE_SEO } from "../../seo/services/research";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { ResearchPageContent } from "../../ui/pages/research-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(RESEARCH_PAGE_SEO);

/** Загружает публичную страницу НИР и лабораторных исследований. */
export default async function ResearchPage() {
  const news = await loadServiceNews("RESEARCH");

  return (
    <>
      <ResearchPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={RESEARCH_PAGE_SEO}
        faq={RESEARCH_FAQ}
      />
    </>
  );
}
