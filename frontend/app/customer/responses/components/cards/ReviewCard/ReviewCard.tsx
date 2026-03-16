"use client";

import { useState } from "react";
import { ProfileIcon, StarIcon, ChevronIcon } from "@/app/icons";
import { Button } from "@/app/components";
import { TechSpecFiles } from "../../sections";
import type { ResponseBadge } from "../../types";
import styles from "../CustomerBaseCard/customerBaseCard.module.scss";

export interface ReviewCardProps {
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

  commentText?: string;
  expertPrice?: string;
  expertDeadline?: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];

  onReject?: () => void;
  onAccept?: () => void;
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

export const ReviewCard = ({
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
  commentText,
  expertPrice,
  expertDeadline,
  techSpecTitle,
  techSpecFiles,
  onReject,
  onAccept,
  isRejectLoading = false,
  isAcceptLoading = false,
}: ReviewCardProps) => {
  const isUpdating = isRejectLoading || isAcceptLoading;
  const [orderExpanded, setOrderExpanded] = useState(false);

  return (
    <article className={styles.card}>
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

      <div className={styles.content}>
        <div className={styles.expertRow}>
          <div className={styles.avatar}>
            <ProfileIcon width={24} height={24} />
          </div>
          <div className={styles.expertDetails}>
            <span className={styles.expertName}>{expertName}</span>
            {expertRating !== null && expertReviewCount > 0 ? (
              <div className={styles.ratingRow}>
                <StarIcon filled width={16} height={16} />
                <div className={styles.ratingValues}>
                  <span className={styles.ratingNumber}>
                    {expertRating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </span>
                  <span className={styles.dot}>&middot;</span>
                  <span className={styles.reviewCount}>{formatReviewCount(expertReviewCount)}</span>
                </div>
              </div>
            ) : (
              <span className={styles.noReviews}>Отзывов пока нет</span>
            )}
          </div>
          {onExpertHistory && (
            <Button variant="outline" size="sm" onClick={onExpertHistory} className={styles.historyBtn}>
              История заказов
            </Button>
          )}
        </div>

        <div className={styles.orderSection}>
          <button
            type="button"
            className={styles.orderTitleRow}
            onClick={() => setOrderExpanded((prev) => !prev)}
          >
            <span className={styles.orderTitle}>{orderTitle}</span>
            <span className={`${styles.chevron} ${orderExpanded ? styles.chevronExpanded : ""}`}>
              <ChevronIcon color="#FFDDA9" />
            </span>
          </button>
          {orderExpanded && (
            <>
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
                <div className={styles.cash}>
                  <span className={styles.sum}>{sum}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {commentText && (
          <div className={styles.commentRow}>
            <span className={styles.commentTitle}>Комментарий:</span>
            <span className={styles.commentText}>{commentText}</span>
          </div>
        )}

        {expertPrice && (
          <div className={styles.commentRow}>
            <span className={styles.commentTitle}>Цена:</span>
            <span className={styles.commentText}>{expertPrice}</span>
          </div>
        )}

        {expertDeadline && (
          <div className={styles.commentRow}>
            <span className={styles.commentTitle}>Срок:</span>
            <span className={styles.commentText}>до {expertDeadline}</span>
          </div>
        )}

        <TechSpecFiles techSpecTitle={techSpecTitle} techSpecFiles={techSpecFiles} />
      </div>

      <div className={styles.actions}>
        <Button
          variant="transparent"
          size="sm"
          fullWidth
          onClick={onReject}
          disabled={isUpdating}
          isLoading={isRejectLoading}
          className={styles.rejectBtn}
        >
          Отклонить
        </Button>
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={onAccept}
          disabled={isUpdating}
          isLoading={isAcceptLoading}
          className={styles.acceptBtn}
        >
          Пригласить в чат
        </Button>
      </div>
    </article>
  );
};
