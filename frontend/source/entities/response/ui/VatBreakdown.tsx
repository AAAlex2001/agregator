import type { VatKind } from "../model/types";
import { calcVat } from "../lib/calcVat";
import s from "./VatBreakdown.module.scss";

interface Props {
  baseAmount: number;
  vatKind: VatKind;
}

function format(value: number) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 2 });
}

export function VatBreakdown({ baseAmount, vatKind }: Props) {
  if (!(baseAmount > 0)) return null;

  const { base, vatRate, vatAmount, total } = calcVat(baseAmount, vatKind);

  if (vatRate === 0) {
    return (
      <div className={s.box}>
        <div className={`${s.row} ${s.totalSolo}`}>
          <span>Итого без НДС:</span>
          <span>{format(total)} ₽</span>
        </div>
      </div>
    );
  }

  return (
    <div className={s.box}>
      <div className={s.row}>
        <span>Сумма без НДС:</span>
        <span>{format(base)} ₽</span>
      </div>
      <div className={s.row}>
        <span>НДС {vatRate}%:</span>
        <span>{format(vatAmount)} ₽</span>
      </div>
      <div className={`${s.row} ${s.total}`}>
        <span>Итого с НДС:</span>
        <span>{format(total)} ₽</span>
      </div>
    </div>
  );
}
