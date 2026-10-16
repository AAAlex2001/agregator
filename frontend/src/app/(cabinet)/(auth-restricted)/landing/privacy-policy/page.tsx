import { LegalDocument } from "@/widgets/legal-document";
import { PRIVACY_POLICY } from "../../../../content/legal/privacy-policy";

/** Показывает политику конфиденциальности внутри кабинета. */
export default function PrivatePrivacyPolicyPage() {
  return (
    <LegalDocument
      {...PRIVACY_POLICY}
      homeHref="/landing"
    />
  );
}
