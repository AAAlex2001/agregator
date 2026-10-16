import { CADASTRAL_FAQ } from "@/widgets/landing";
import { loadServiceNews } from "../../content/load-service-news";
import { CADASTRAL_PAGE_SEO } from "../../seo/services/cadastral";
import { createServiceMetadata } from "../../seo/services/create-service-metadata";
import { CadastralPageContent } from "../../ui/pages/cadastral-page-content";
import { ServiceJsonLd } from "../../ui/seo/service-json-ld";

export const metadata = createServiceMetadata(CADASTRAL_PAGE_SEO);

/** Загружает публичную страницу кадастровых работ. */
export default async function CadastralPage() {
  const news = await loadServiceNews("CADASTRAL");

  return (
    <>
      <CadastralPageContent
        news={news}
        isPublic
      />
      <ServiceJsonLd
        service={CADASTRAL_PAGE_SEO}
        faq={CADASTRAL_FAQ}
      />
    </>
  );
}
