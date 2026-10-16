import { LegalDocument } from "@/widgets/legal-document";
import { REQUISITES } from "../../../../content/legal/requisites";

/** Показывает реквизиты компании внутри кабинета. */
export default function PrivateRequisitesPage() {
  return (
    <LegalDocument
      {...REQUISITES}
      homeHref="/landing"
    />
  );
}
