import { SURVEY_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { SURVEY_PAGE_SEO } from "../../seo/services/survey";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { SurveyPageContent } from "../../ui/pages/survey-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(SURVEY_PAGE_SEO);

/** Загружает публичную страницу инженерных изысканий. */
export default async function SurveyPage() {
  const news = await loadServiceNews("SURVEY");

  return (
    <>
      <SurveyPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={SURVEY_PAGE_SEO}
        faq={SURVEY_FAQ}
      />
    </>
  );
}
