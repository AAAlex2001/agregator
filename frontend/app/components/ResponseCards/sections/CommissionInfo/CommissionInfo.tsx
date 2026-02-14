"use client";

import styles from "./commissionInfo.module.scss";

interface CommissionInfoProps {
  commissionText: string;
  commissionAmount: string;
  commissionStatus?: string;
  balanceReturnText?: string;
  balanceReturnAmount?: string;
  highlighted?: boolean;
}

const CommissionInfo = ({
  commissionText,
  commissionAmount,
  commissionStatus,
  balanceReturnText,
  balanceReturnAmount,
  highlighted = false,
}: CommissionInfoProps) => (
  <div
    className={`${styles.balanceRow} ${highlighted ? styles.highlighted : ""}`}
  >
    <div className={styles.commissionRow}>
      <span className={styles.commissionLabel}>{commissionText}</span>
      <span className={styles.commissionAmount}>{commissionAmount}</span>
      {commissionStatus && (
        <span className={styles.commissionStatus}>{commissionStatus}</span>
      )}
    </div>
    {balanceReturnText && balanceReturnAmount && (
      <div className={styles.balanceReturn}>
        <span className={styles.balanceReturnLabel}>{balanceReturnText}</span>
        <span className={styles.balanceReturnAmount}>
          {balanceReturnAmount}
        </span>
      </div>
    )}
  </div>
);

export default CommissionInfo;
