import { LegalDocument } from "@/widgets/legal-document";
import { USER_AGREEMENT } from "../../../../content/legal/user-agreement";

/** Показывает пользовательское соглашение внутри кабинета. */
export default function PrivateUserAgreementPage() {
  return (
    <LegalDocument
      {...USER_AGREEMENT}
      homeHref="/landing"
    />
  );
}
