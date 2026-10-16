import { loadServiceNews } from "../../../../content/load-service-news";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { EcologyPageContent } from "../../../../ui/pages/ecology-page-content";

export const metadata = createPrivateMetadata("Экологическое сопровождение предприятий");

/** Загружает страницу кабинета для экологического сопровождения. */
export default async function PrivateEcologyPage() {
  const news = await loadServiceNews("ECOLOGY");

  return <EcologyPageContent news={news} />;
}
