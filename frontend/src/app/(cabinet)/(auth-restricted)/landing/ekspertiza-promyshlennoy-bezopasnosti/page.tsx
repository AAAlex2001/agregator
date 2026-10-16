import { getLandingContent } from "@/entities/landing-content/server";
import { loadServiceNews } from "../../../../content/load-service-news";
import { ExpertisePageContent } from "../../../../ui/pages/expertise-page-content";

/** Загружает страницу кабинета для экспертизы промышленной безопасности. */
export default async function PrivateExpertisePage() {
  const [content, news] = await Promise.all([
    getLandingContent(),
    loadServiceNews("EXPERTISE"),
  ]);

  return (
    <ExpertisePageContent
      content={content}
      news={news}
    />
  );
}
