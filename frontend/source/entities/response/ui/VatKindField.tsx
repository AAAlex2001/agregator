"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { VAT_LABEL, type VatKind } from "../model/types";
import { VatBreakdown } from "./VatBreakdown";

const VAT_TABS = [
  { id: "NONE", label: VAT_LABEL.NONE },
  { id: "VAT_5", label: VAT_LABEL.VAT_5 },
  { id: "VAT_7", label: VAT_LABEL.VAT_7 },
  { id: "VAT_22", label: VAT_LABEL.VAT_22 },
];

interface VatKindFieldProps {
  value: VatKind;
  baseAmount: number;
  onChange: (value: VatKind) => void;
}

/** Ставка НДС вкладками и сумма с налогом под ними. */
export function VatKindField({ value, baseAmount, onChange }: VatKindFieldProps) {
  return (
    <>
      <Tabs variant="squared" tabs={VAT_TABS} activeTab={value} onTabChange={(id) => onChange(id as VatKind)} />
      <VatBreakdown baseAmount={baseAmount} vatKind={value} />
    </>
  );
}
