import { loadHomePage } from "../../../content/load-home-page";
import { HomePageContent } from "../../../ui/pages/home-page-content";

export const dynamic = "force-dynamic";

/** Показывает главную внутри кабинета с его ссылками и унаследованным noindex. */
export default async function PrivateHomePage() {
  const data = await loadHomePage();

  return <HomePageContent data={data} />;
}
