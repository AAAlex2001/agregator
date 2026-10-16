import { loadServiceNews } from "../../../../content/load-service-news";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { TechDiagPageContent } from "../../../../ui/pages/tech-diag-page-content";

export const metadata = createPrivateMetadata(
  "Техническое освидетельствование и диагностирование",
);

/** Загружает страницу кабинета для технического диагностирования. */
export default async function PrivateTechDiagPage() {
  const news = await loadServiceNews("TECH_DIAG");

  return <TechDiagPageContent news={news} />;
}
