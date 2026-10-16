"use client";

import { Button } from "@/shared/ui/button";
import { useOpenContactDeal } from "../../model/use-open-contact-deal";

/** Сделка из списка текущего пользователя и оформление кнопки в строке. */
interface OpenContactDealButtonProps {
  dealId: number;
  className?: string;
}

/** Открывает договор, оплату и контакты выбранной сделки. */
export function OpenContactDealButton({ dealId, className }: OpenContactDealButtonProps) {
  const { isOpening, openDeal } = useOpenContactDeal();

  return (
    <Button
      variant="outlineOrange"
      size="sm"
      className={className}
      isLoading={isOpening}
      onClick={() => openDeal(dealId)}
    >
      Открыть
    </Button>
  );
}
