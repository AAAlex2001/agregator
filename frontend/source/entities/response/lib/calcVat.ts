import type { VatKind } from "../model/types";

const VAT_RATE: Record<VatKind, number> = {
  NONE: 0,
  VAT_5: 5,
  VAT_7: 7,
  VAT_22: 22,
};

export interface VatBreakdown {
  base: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export function calcVat(baseAmount: number, vatKind: VatKind): VatBreakdown {
  const rate = VAT_RATE[vatKind] ?? 0;
  const base = Number.isFinite(baseAmount) ? baseAmount : 0;
  const vatAmount = (base * rate) / 100;
  return {
    base,
    vatRate: rate,
    vatAmount,
    total: base + vatAmount,
  };
}

export function getVatRate(vatKind: VatKind): number {
  return VAT_RATE[vatKind] ?? 0;
}
