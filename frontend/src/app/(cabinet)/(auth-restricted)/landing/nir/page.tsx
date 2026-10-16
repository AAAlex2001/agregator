import { loadServiceNews } from "../../../../content/load-service-news";
import { ResearchPageContent } from "../../../../ui/pages/research-page-content";

export const dynamic = "force-dynamic";

/** Загружает страницу кабинета для НИР и лабораторных исследований. */
export default async function PrivateResearchPage() {
  const news = await loadServiceNews("RESEARCH");

  return <ResearchPageContent news={news} />;
}
