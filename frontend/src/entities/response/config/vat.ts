import type { VatKind } from "../model/types";

/** Вариант налогообложения для формы предложения и расчёта стоимости. */
interface VatOption {
  id: VatKind;
  label: string;
  rate: number;
}

/** Ставки и подписи НДС, поддерживаемые API откликов. */
export const VAT_OPTIONS: VatOption[] = [
  {
    id: "NONE",
    label: "Без НДС",
    rate: 0,
  },
  {
    id: "VAT_5",
    label: "С НДС 5%",
    rate: 5,
  },
  {
    id: "VAT_7",
    label: "С НДС 7%",
    rate: 7,
  },
  {
    id: "VAT_22",
    label: "С НДС 22%",
    rate: 22,
  },
];
