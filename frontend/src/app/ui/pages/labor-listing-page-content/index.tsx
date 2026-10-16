"use client";

import type { LaborListing } from "@/entities/labor";
import { PublicLaborListing } from "@/widgets/public-labor-listing";
import { useAuthentication } from "../../../providers/authentication";

/** Объявление, загруженное на сервере. */
interface LaborListingPageContentProps {
  item: LaborListing;
}

/** Связывает публичное объявление с общим окном входа. */
export function LaborListingPageContent({ item }: LaborListingPageContentProps) {
  const { openLogin } = useAuthentication();

  return (
    <PublicLaborListing
      item={item}
      onOpenLogin={openLogin}
    />
  );
}
