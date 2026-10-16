import { loadServiceNews } from "../../../../content/load-service-news";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { DesignPageContent } from "../../../../ui/pages/design-page-content";

export const metadata = createPrivateMetadata(
  "Проектирование промышленных и гражданских объектов",
);

/** Загружает страницу кабинета для проектирования. */
export default async function PrivateDesignPage() {
  const news = await loadServiceNews("DESIGN");

  return <DesignPageContent news={news} />;
}
