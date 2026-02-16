import styles from "./sections.module.scss";

interface CommissionConfirmProps {
  commissionDisplay: string;
}

export default function CommissionConfirm({ commissionDisplay }: CommissionConfirmProps) {
  return (
    <div className={styles.commissionConfirm}>
      <span className={styles.commissionText}>Взнос в размере</span>
      <span className={styles.commissionAmount}>{commissionDisplay}</span>
      <span className={styles.commissionText}>получен</span>
    </div>
  );
}
