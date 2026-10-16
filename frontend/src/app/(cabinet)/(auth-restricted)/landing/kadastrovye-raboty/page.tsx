import { loadServiceNews } from "../../../../content/load-service-news";
import { CadastralPageContent } from "../../../../ui/pages/cadastral-page-content";

export const dynamic = "force-dynamic";

/** Загружает страницу кабинета для кадастровых работ. */
export default async function PrivateCadastralPage() {
  const news = await loadServiceNews("CADASTRAL");

  return <CadastralPageContent news={news} />;
}
