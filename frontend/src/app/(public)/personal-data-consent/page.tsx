import { LegalDocument } from "@/widgets/legal-document";
import { PERSONAL_DATA_CONSENT } from "../../content/legal/personal-data-consent";
import { PERSONAL_DATA_CONSENT_METADATA } from "../../seo/legal";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = PERSONAL_DATA_CONSENT_METADATA;

/** Показывает согласие на обработку персональных данных. */
export default function PersonalDataConsentPage() {
  return (
    <PublicSiteShell redirectTo="/landing/personal-data-consent">
      <LegalDocument
        {...PERSONAL_DATA_CONSENT}
        homeHref="/"
      />
    </PublicSiteShell>
  );
}
