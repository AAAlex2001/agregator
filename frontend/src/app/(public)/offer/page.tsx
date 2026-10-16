import { LegalDocument } from "@/widgets/legal-document";
import { OFFER } from "../../content/legal/offer";
import { OFFER_METADATA } from "../../seo/legal";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = OFFER_METADATA;

/** Показывает публичную оферту с сохранёнными SEO-настройками. */
export default function OfferPage() {
  return (
    <PublicSiteShell redirectTo="/landing/offer">
      <LegalDocument
        {...OFFER}
        homeHref="/"
      />
    </PublicSiteShell>
  );
}
