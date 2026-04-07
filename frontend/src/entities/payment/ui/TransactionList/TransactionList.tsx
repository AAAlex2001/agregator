import { formatPaymentDate, formatTransactionText } from "@/shared/lib/formatMoney";
import type { PaymentItem } from "@/features/balance/topup/model/types";
import styles from "./transaction-list.module.scss";

interface TransactionListProps {
  payments: PaymentItem[];
}

export function TransactionList({ payments }: TransactionListProps) {
  if (payments.length === 0) {
    return <p className={styles.empty}>Операций пока нет</p>;
  }

  const mid = Math.ceil(payments.length / 2);
  const left = payments.slice(0, mid);
  const right = payments.slice(mid);

  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        {left.map((item) => (
          <div key={item.id} className={styles.row}>
            <span className={styles.date}>{formatPaymentDate(item.created_at)}</span>
            <span className={styles.text}>{formatTransactionText(item)}</span>
          </div>
        ))}
      </div>
      {right.length > 0 && (
        <div className={styles.column}>
          {right.map((item) => (
            <div key={item.id} className={styles.row}>
              <span className={styles.date}>{formatPaymentDate(item.created_at)}</span>
              <span className={styles.text}>{formatTransactionText(item)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
