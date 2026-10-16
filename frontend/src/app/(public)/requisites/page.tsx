import { LegalDocument } from "@/widgets/legal-document";
import { REQUISITES } from "../../content/legal/requisites";
import { REQUISITES_METADATA } from "../../seo/legal";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = REQUISITES_METADATA;

/** Показывает реквизиты компании с сохранёнными SEO-настройками. */
export default function RequisitesPage() {
  return (
    <PublicSiteShell redirectTo="/landing/requisites">
      <LegalDocument
        {...REQUISITES}
        homeHref="/"
      />
    </PublicSiteShell>
  );
}
