import { LegalDocument } from "@/widgets/legal-document";
import { USER_AGREEMENT } from "../../content/legal/user-agreement";
import { USER_AGREEMENT_METADATA } from "../../seo/legal";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = USER_AGREEMENT_METADATA;

/** Показывает пользовательское соглашение с сохранёнными SEO-настройками. */
export default function UserAgreementPage() {
  return (
    <PublicSiteShell redirectTo="/landing/user-agreement">
      <LegalDocument
        {...USER_AGREEMENT}
        homeHref="/"
      />
    </PublicSiteShell>
  );
}
