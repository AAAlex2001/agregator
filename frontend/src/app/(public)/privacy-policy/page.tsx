import { LegalDocument } from "@/widgets/legal-document";
import { PRIVACY_POLICY } from "../../content/legal/privacy-policy";
import { PRIVACY_POLICY_METADATA } from "../../seo/legal";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = PRIVACY_POLICY_METADATA;

/** Показывает политику конфиденциальности с сохранёнными SEO-настройками. */
export default function PrivacyPolicyPage() {
  return (
    <PublicSiteShell redirectTo="/landing/privacy-policy">
      <LegalDocument
        {...PRIVACY_POLICY}
        homeHref="/"
      />
    </PublicSiteShell>
  );
}
