"use client";

import { Tabs } from "@/shared/ui/tabs";
import { VAT_OPTIONS } from "../../config/vat";
import type { VatKind } from "../../model/types";
import { VatBreakdown } from "../vat-breakdown";

/** Ставка предложения, его стоимость и подтверждение выбранного варианта. */
interface VatKindFieldProps {
  value: VatKind;
  baseAmount: number;
  onChange: (value: VatKind) => void;
}

/** Выбирает ставку НДС и показывает итоговую стоимость с налогом. */
export function VatKindField({
  value,
  baseAmount,
  onChange,
}: VatKindFieldProps) {
  /** Передаёт только ставку из доступных API вариантов. */
  function changeVatKind(id: string) {
    const option = VAT_OPTIONS.find((item) => item.id === id);

    if (option) {
      onChange(option.id);
    }
  }

  return (
    <>
      <Tabs
        tabs={VAT_OPTIONS}
        activeTab={value}
        onTabChange={changeVatKind}
      />
      <VatBreakdown
        baseAmount={baseAmount}
        vatKind={value}
      />
    </>
  );
}
