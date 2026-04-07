"use client";

import Button from "@/shared/ui/Button";
import type { ResponseBadge } from "@/features/response/list-expert/ui/component-types";
import styles from "./withdrawConfirmModal.module.scss";

interface WithdrawConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  balanceReturnAmount?: string;
}

const WITHDRAW_WARNINGS_BASE = [
  "Заказчик больше не увидит ваше предложение",
  "Вы сможете откликнуться на этот заказ повторно",
];

const WithdrawConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
  isLoading = false,
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  balanceReturnAmount,
}: WithdrawConfirmModalProps) => {
  if (!isOpen) return null;

  const warnings = balanceReturnAmount
    ? WITHDRAW_WARNINGS_BASE
    : ["Взнос за участие в тендере не возвращается", ...WITHDRAW_WARNINGS_BASE];

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.statusDateRow}>
            <div className={styles.dateRow}>
              <span className={styles.dateLabel}>{dateLabel}</span>
              <span className={styles.dateValue}>{date}</span>
            </div>
            <span
              className={styles.statusBadge}
              style={{ color: statusColor, background: statusBg }}
            >
              {status}
            </span>
          </div>

          <div className={styles.inner}>
            <h2 className={styles.title}>Вы уверены, что хотите отозвать ваше предложение?</h2>

            <div className={styles.orderBlock}>
              <div className={styles.orderTitleRow}>
                <span className={styles.orderTitle}>{orderTitle}</span>
              </div>
              <span className={styles.customer}>{customer}</span>
              <div className={styles.orderMeta}>
                <span className={styles.orderDate}>{orderDate}</span>
                <div className={styles.badges}>
                  {badges.map((badge, index) => (
                    <span key={index} className={`${styles.badge} ${styles[badge.variant]}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
                <span className={styles.sum}>{sum}</span>
              </div>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoTitle}>Обратите внимание:</span>
              <ul className={styles.bulletList}>
                {balanceReturnAmount && (
                  <li className={styles.bulletItem}>
                    <span className={styles.bulletDot} />
                    <span className={styles.bulletText}>
                      На ваш баланс вернется <strong>{balanceReturnAmount}</strong>
                    </span>
                  </li>
                )}
                {warnings.map((text) => (
                  <li key={text} className={styles.bulletItem}>
                    <span className={styles.bulletDot} />
                    <span className={styles.bulletText}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button variant="chat" fullWidth onClick={onCancel}>
            Отменить
          </Button>
          <Button variant="outline" fullWidth onClick={onConfirm} isLoading={isLoading}>
            Отозвать отклик
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawConfirmModal;
