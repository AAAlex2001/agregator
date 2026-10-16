import { VAT_OPTIONS } from "../config/vat";
import type { VatBreakdown, VatKind } from "./types";

/** Возвращает процент выбранной ставки; неизвестное значение считается без НДС. */
export function getVatRate(vatKind: VatKind): number {
  return VAT_OPTIONS.find((option) => option.id === vatKind)?.rate ?? 0;
}

/** Рассчитывает НДС поверх предложенной стоимости работ. */
export function calculateVat(baseAmount: number, vatKind: VatKind): VatBreakdown {
  const base = Number.isFinite(baseAmount) ? baseAmount : 0;
  const vatRate = getVatRate(vatKind);
  const vatAmount = base * vatRate / 100;

  return {
    base,
    vatRate,
    vatAmount,
    total: base + vatAmount,
  };
}
