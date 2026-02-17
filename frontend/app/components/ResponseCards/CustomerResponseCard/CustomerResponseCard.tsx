"use client";

import { ProfileIcon, StarIcon } from "@/app/icons";
import { Loader } from "@/app/components";
import type { ResponseBadge } from "../types";
import styles from "./customerResponseCard.module.scss";

export interface CustomerResponseCardProps {
  dateLabel: string;
  date: string;
  status: string;
  statusColor?: string;
  statusBg?: string;

  expertName: string;
  expertRating: number | null;
  expertReviewCount: number;
  onExpertHistory?: () => void;

  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;

  rejectBtnText?: string;
  acceptBtnText?: string;
  onReject?: () => void;
  onAccept?: () => void;
  showActions?: boolean;
  isRejectLoading?: boolean;
  isAcceptLoading?: boolean;
}

function formatReviewCount(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} отзывов`;
  if (lastOne === 1) return `${count} отзыв`;
  if (lastOne >= 2 && lastOne <= 4) return `${count} отзыва`;
  return `${count} отзывов`;
}

const CustomerResponseCard = ({
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  expertName,
  expertRating,
  expertReviewCount,
  onExpertHistory,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  rejectBtnText = "Отклонить",
  acceptBtnText = "Пригласить в чат",
  onReject,
  onAccept,
  showActions = true,
  isRejectLoading = false,
  isAcceptLoading = false,
}: CustomerResponseCardProps) => {
  const isUpdating = isRejectLoading || isAcceptLoading;

  return (
    <article className={styles.card}>
      {/* header: date + status */}
      <div className={styles.header}>
        <div className={styles.date}>
          <span className={styles.dateLabel}>{dateLabel}</span>
          <span className={styles.dateValue}>{date}</span>
        </div>
        <span
          className={styles.statusBadge}
          style={{
            ...(statusColor ? { color: statusColor } : {}),
            ...(statusBg ? { background: statusBg } : {}),
          }}
        >
          {status}
        </span>
      </div>

      {/* content */}
      <div className={styles.content}>
        {/* expert info */}
        <div className={styles.expertRow}>
          <div className={styles.avatar}>
            <ProfileIcon width={24} height={24} />
          </div>

          <div className={styles.expertDetails}>
            <span className={styles.expertName}>{expertName}</span>
            {expertRating !== null && (
              <div className={styles.ratingRow}>
                <StarIcon filled width={16} height={16} />
                <div className={styles.ratingValues}>
                  <span className={styles.ratingNumber}>
                    {expertRating.toLocaleString("ru-RU", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </span>
                  <span className={styles.dot}>&middot;</span>
                  <span className={styles.reviewCount}>
                    {formatReviewCount(expertReviewCount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {onExpertHistory && (
            <button
              type="button"
              className={styles.historyBtn}
              onClick={onExpertHistory}
            >
              История заказов
            </button>
          )}
        </div>

        {/* order */}
        <div className={styles.orderSection}>
          <span className={styles.orderTitle}>{orderTitle}</span>
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
      </div>

      {/* actions */}
      {showActions && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={onReject}
            disabled={isUpdating}
          >
            {isRejectLoading ? <Loader label="" size="sm" /> : rejectBtnText}
          </button>
          <button
            type="button"
            className={styles.acceptBtn}
            onClick={onAccept}
            disabled={isUpdating}
          >
            {isAcceptLoading ? <Loader label="" size="sm" /> : acceptBtnText}
          </button>
        </div>
      )}
    </article>
  );
};

export default CustomerResponseCard;
