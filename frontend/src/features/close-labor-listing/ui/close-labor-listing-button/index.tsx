"use client";

import { Button } from "@/shared/ui/button";
import { useCloseLaborListing } from "../../model/use-close-labor-listing";

/** Своё объявление и обновление списка после его закрытия. */
interface CloseLaborListingButtonProps {
  listingId: number;
  onClosed: () => void;
}

/** Снимает объявление с публикации. */
export function CloseLaborListingButton({
  listingId,
  onClosed,
}: CloseLaborListingButtonProps) {
  const { isClosing, close } = useCloseLaborListing(listingId, onClosed);

  return (
    <Button
      variant="transparent"
      size="sm"
      disabled={isClosing}
      onClick={close}
    >
      Закрыть заявку
    </Button>
  );
}
