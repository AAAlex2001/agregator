import styles from "./sections.module.scss";

interface CommissionConfirmProps {
  commissionDisplay: string;
}

export default function CommissionConfirm({ commissionDisplay }: CommissionConfirmProps) {
  const isUndefined = commissionDisplay === "Не определено" || commissionDisplay === "0 ₽";

  if (isUndefined) {
    return (
      <div className={styles.commissionConfirm}>
        <span className={styles.commissionText}>
          Взнос 5% будет рассчитан от вашей предложенной стоимости
        </span>
      </div>
    );
  }

  return (
    <div className={styles.commissionConfirm}>
      <span className={styles.commissionText}>Взнос в размере</span>
      <span className={styles.commissionAmount}>{commissionDisplay}</span>
      <span className={styles.commissionText}>получен</span>
    </div>
  );
}
