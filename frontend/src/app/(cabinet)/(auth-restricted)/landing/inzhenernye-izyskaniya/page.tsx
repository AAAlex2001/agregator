import { loadServiceNews } from "../../../../content/load-service-news";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { SurveyPageContent } from "../../../../ui/pages/survey-page-content";

export const metadata = createPrivateMetadata("Инженерные изыскания");

/** Загружает страницу кабинета для инженерных изысканий. */
export default async function PrivateSurveyPage() {
  const news = await loadServiceNews("SURVEY");

  return <SurveyPageContent news={news} />;
}
