import classNames from "classnames";
import { calculateVat } from "../../model/calculate-vat";
import type { VatKind } from "../../model/types";
import styles from "./style.module.scss";

/** Стоимость работ и выбранная ставка для показа итоговой суммы. */
interface VatBreakdownProps {
  baseAmount: number;
  vatKind: VatKind;
}

/** Форматирует сумму в рублях с точностью до двух знаков. */
function formatAmount(amount: number): string {
  return amount.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
  });
}

/** Показывает стоимость работ, налог и общую сумму предложения. */
export function VatBreakdown({ baseAmount, vatKind }: VatBreakdownProps) {
  if (!(baseAmount > 0)) {
    return null;
  }

  const { base, vatRate, vatAmount, total } = calculateVat(baseAmount, vatKind);

  if (vatRate === 0) {
    return (
      <div className={styles.box}>
        <div className={classNames(styles.row, styles.totalSolo)}>
          <span>Итого без НДС:</span>
          <span>{formatAmount(total)} ₽</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.box}>
      <div className={styles.row}>
        <span>Сумма без НДС:</span>
        <span>{formatAmount(base)} ₽</span>
      </div>
      <div className={styles.row}>
        <span>НДС {vatRate}%:</span>
        <span>{formatAmount(vatAmount)} ₽</span>
      </div>
      <div className={classNames(styles.row, styles.total)}>
        <span>Итого с НДС:</span>
        <span>{formatAmount(total)} ₽</span>
      </div>
    </div>
  );
}
