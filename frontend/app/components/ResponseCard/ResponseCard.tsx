"use client";

import { ChevronIcon } from "@/app/icons";
import Button from "@/app/components/Button";
import styles from "./responseCard.module.scss";

export interface ResponseBadge {
  text: string;
  variant: "blue" | "green";
}

export interface ResponseCardProps {
  dateLabel: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  statusMessage?: string;
  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;
  deadline: string;
  costEstimate: string;
  commissionText: string;
  commissionAmount: string;
  commissionStatus?: string;
  balanceReturnText?: string;
  balanceReturnAmount?: string;
  commentTitle: string;
  commentText: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  reminderText?: string;
  reminderDays?: string;
  editBtnText?: string;
  payBtnText?: string;
  onEdit?: () => void;
  onPay?: () => void;
}

const ResponseCard = ({
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  statusMessage,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  deadline,
  costEstimate,
  commissionText,
  commissionAmount,
  commissionStatus,
  balanceReturnText,
  balanceReturnAmount,
  commentTitle,
  commentText,
  techSpecTitle,
  techSpecFiles,
  reminderText,
  reminderDays,
  editBtnText = "Редактировать отклик",
  payBtnText = "Оплатить и получить заказ",
  onEdit,
  onPay,
}: ResponseCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        {/* Status + Date header */}
        <div className={styles.statusDateRow}>
          <div className={styles.dateRow}>
            <span className={styles.dateLabel}>{dateLabel}</span>
            <span className={styles.dateValue}>{date}</span>
          </div>
          {statusMessage && (
            <span className={styles.statusMessage}>{statusMessage}</span>
          )}
          <span
            className={styles.statusBadge}
            style={{ color: statusColor, background: statusBg }}
          >
            {status}
          </span>
        </div>

        {/* Bottom content */}
        <div className={styles.bottomContent}>
          {/* Order section */}
          <div className={styles.orderSection}>
            <div className={styles.orderTitleRow}>
              <span className={styles.orderTitle}>{orderTitle}</span>
              <ChevronIcon className={styles.chevron} />
            </div>
            <span className={styles.customer}>{customer}</span>
            <div className={styles.orderMeta}>
              <span className={styles.orderDate}>{orderDate}</span>
              <div className={styles.badges}>
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`${styles.badge} ${styles[badge.variant]}`}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
              <div className={styles.cash}>
                <span className={styles.sum}>{sum}</span>
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className={styles.infoSection}>
            {/* Expert's terms */}
            <div className={styles.termsRow}>
              <div className={styles.termItem}>
                <span className={styles.termLabel}>Ваши сроки:</span>
                <span className={styles.termValue}>{deadline}</span>
              </div>
              <div className={styles.costItem}>
                <span className={styles.termLabel}>
                  Ваша оценка стоимости работ:
                </span>
                <span className={styles.termValue}>{costEstimate}</span>
              </div>
            </div>

            {/* Commission info */}
            <div className={styles.balanceRow}>
              <div className={styles.commissionRow}>
                <span className={styles.commissionLabel}>{commissionText}</span>
                <span className={styles.commissionAmount}>
                  {commissionAmount}
                </span>
                {commissionStatus && (
                  <span className={styles.commissionStatus}>
                    {commissionStatus}
                  </span>
                )}
              </div>
              {balanceReturnText && balanceReturnAmount && (
                <div className={styles.balanceReturn}>
                  <span className={styles.balanceReturnLabel}>
                    {balanceReturnText}
                  </span>
                  <span className={styles.balanceReturnAmount}>
                    {balanceReturnAmount}
                  </span>
                </div>
              )}
            </div>

            {/* Comment */}
            <div className={styles.commentRow}>
              <span className={styles.commentTitle}>{commentTitle}</span>
              <span className={styles.commentText}>{commentText}</span>
            </div>

            {/* Tech spec files */}
            {techSpecTitle && techSpecFiles && techSpecFiles.length > 0 && (
              <div className={styles.filesRow}>
                <span className={styles.filesTitle}>{techSpecTitle}</span>
                <div className={styles.filesList}>
                  {techSpecFiles.map((file, index) => (
                    <a key={index} href="#" className={styles.fileLink}>
                      {file}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reminder */}
            {reminderText && reminderDays && (
              <div className={styles.reminderRow}>
                <span className={styles.reminderText}>{reminderText}</span>
                <span className={styles.reminderDays}>{reminderDays}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={styles.actions}>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={onEdit}
          className={styles.editBtn}
        >
          {editBtnText}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onPay}
          className={styles.payBtn}
        >
          {payBtnText}
        </Button>
      </div>
    </article>
  );
};

export default ResponseCard;
