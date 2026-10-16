import { LegalDocument } from "@/widgets/legal-document";
import { PERSONAL_DATA_CONSENT } from "../../../../content/legal/personal-data-consent";

/** Показывает согласие на обработку персональных данных внутри кабинета. */
export default function PrivatePersonalDataConsentPage() {
  return (
    <LegalDocument
      {...PERSONAL_DATA_CONSENT}
      homeHref="/landing"
    />
  );
}
