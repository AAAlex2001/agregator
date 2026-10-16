import { LegalDocument } from "@/widgets/legal-document";
import { OFFER } from "../../../../content/legal/offer";

/** Показывает публичную оферту внутри кабинета. */
export default function PrivateOfferPage() {
  return (
    <LegalDocument
      {...OFFER}
      homeHref="/landing"
    />
  );
}
