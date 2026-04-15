import { formatPaymentDate, formatTransactionText } from "@/source/shared/lib/formatMoney";
import type { PaymentItem } from "../model/types";
import s from "./TransactionList.module.scss";

interface TransactionListProps {
  payments: PaymentItem[];
}

export function TransactionList({ payments }: TransactionListProps) {
  if (payments.length === 0) {
    return <p className={s.empty}>Операций пока нет</p>;
  }

  const mid = Math.ceil(payments.length / 2);
  const left = payments.slice(0, mid);
  const right = payments.slice(mid);

  return (
    <div className={s.columns}>
      <div className={s.column}>
        {left.map((item) => (
          <div key={item.id} className={s.row}>
            <span className={s.date}>{formatPaymentDate(item.created_at)}</span>
            <span className={s.text}>{formatTransactionText(item)}</span>
          </div>
        ))}
      </div>
      {right.length > 0 && (
        <div className={s.column}>
          {right.map((item) => (
            <div key={item.id} className={s.row}>
              <span className={s.date}>{formatPaymentDate(item.created_at)}</span>
              <span className={s.text}>{formatTransactionText(item)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
