import { loadHomePage } from "../content/load-home-page";
import { HOME_PAGE_METADATA } from "../seo/home";
import { HomePageContent } from "../ui/pages/home-page-content";
import { HomeJsonLd } from "../ui/seo/home-json-ld";

export const dynamic = "force-dynamic";
export const metadata = HOME_PAGE_METADATA;

/** Загружает публичную главную с исходными секциями и поисковой разметкой. */
export default async function HomePage() {
  const data = await loadHomePage();

  return (
    <>
      <HomeJsonLd faq={data.content.faq} />
      <HomePageContent
        data={data}
        isPublic
      />
    </>
  );
}
