import styles from "./sections.module.scss";

interface CommissionConfirmProps {
  commission: number;
}

function formatNumber(value: number): string {
  return value.toLocaleString("ru-RU");
}

export default function CommissionConfirm({ commission }: CommissionConfirmProps) {
  return (
    <div className={styles.commissionConfirm}>
      <span className={styles.commissionText}>Взнос в размере</span>
      <span className={styles.commissionAmount}>{formatNumber(commission)}{"\u00A0₽"}</span>
      <span className={styles.commissionText}>получен</span>
    </div>
  );
}
