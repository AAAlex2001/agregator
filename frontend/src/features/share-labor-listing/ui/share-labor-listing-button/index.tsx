"use client";

import { Button } from "@/shared/ui/button";
import { useShareLaborListing } from "../../model/use-share-labor-listing";

/** Публичный идентификатор объявления для ссылки. */
interface ShareLaborListingButtonProps {
  publicId: string;
}

/** Копирует ссылку на публичную страницу объявления. */
export function ShareLaborListingButton({ publicId }: ShareLaborListingButtonProps) {
  const shareListing = useShareLaborListing();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => shareListing(publicId)}
    >
      Поделиться
    </Button>
  );
}
