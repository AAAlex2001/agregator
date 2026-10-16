import { loadServiceNews } from "../../../../content/load-service-news";
import { ForensicPageContent } from "../../../../ui/pages/forensic-page-content";

export const dynamic = "force-dynamic";

/** Загружает страницу кабинета для судебной экспертизы. */
export default async function PrivateForensicPage() {
  const news = await loadServiceNews("FORENSIC");

  return <ForensicPageContent news={news} />;
}
