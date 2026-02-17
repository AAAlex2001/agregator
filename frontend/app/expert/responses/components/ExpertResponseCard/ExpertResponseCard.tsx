"use client";

import {
  StatusHeader,
  ExpertInfo,
  OrderSection,
  ExpertTerms,
  CommissionInfo,
  CommentSection,
  TechSpecFiles,
  ReminderSection,
  ActionButtons,
} from "../sections";
import type { ResponseBadge } from "../types";
import styles from "./expertResponseCard.module.scss";

export interface ExpertResponseCardProps {
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
  collapsibleOrderMeta?: boolean;
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
  middleBtnText?: string;
  payBtnText?: string;
  onEdit?: () => void;
  onMiddle?: () => void;
  onPay?: () => void;
  showActions?: boolean;
  editBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  middleBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  payBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  hideEditButton?: boolean;
  isEditLoading?: boolean;
  isMiddleLoading?: boolean;
  isPayLoading?: boolean;
  expertName?: string;
  expertRating?: number | null;
  expertReviewCount?: number;
  onExpertHistory?: () => void;
}

const ExpertResponseCard = (props: ExpertResponseCardProps) => {
  const hasContentBelowOrder =
    Boolean(props.deadline?.trim()) ||
    Boolean(props.costEstimate?.trim()) ||
    Boolean(props.commissionText?.trim()) ||
    Boolean(props.commissionAmount?.trim()) ||
    Boolean(props.commentTitle?.trim()) ||
    Boolean(props.commentText?.trim()) ||
    Boolean(props.techSpecTitle?.trim()) ||
    Boolean(props.techSpecFiles?.length) ||
    Boolean(props.reminderText?.trim()) ||
    Boolean(props.reminderDays?.trim()) ||
    props.showActions !== false;

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <StatusHeader
          dateLabel={props.dateLabel}
          date={props.date}
          status={props.status}
          statusColor={props.statusColor}
          statusBg={props.statusBg}
          statusMessage={props.statusMessage}
        />

        {props.expertName && (
          <ExpertInfo
            expertName={props.expertName}
            expertRating={props.expertRating ?? null}
            expertReviewCount={props.expertReviewCount ?? 0}
            onHistory={props.onExpertHistory}
          />
        )}

        <div className={styles.bottomContent}>
          <OrderSection
            orderTitle={props.orderTitle}
            customer={props.customer}
            orderDate={props.orderDate}
            badges={props.badges}
            sum={props.sum}
            collapsible={props.collapsibleOrderMeta}
            hideDividerOnDesktop={!hasContentBelowOrder}
          />

          <div className={styles.infoSection}>
            <ExpertTerms
              deadline={props.deadline}
              costEstimate={props.costEstimate}
            />
            <CommissionInfo
              commissionText={props.commissionText}
              commissionAmount={props.commissionAmount}
              commissionStatus={props.commissionStatus}
              balanceReturnText={props.balanceReturnText}
              balanceReturnAmount={props.balanceReturnAmount}
            />
            <CommentSection
              commentTitle={props.commentTitle}
              commentText={props.commentText}
            />
            <TechSpecFiles
              techSpecTitle={props.techSpecTitle}
              techSpecFiles={props.techSpecFiles}
            />
            <ReminderSection
              reminderText={props.reminderText}
              reminderDays={props.reminderDays}
            />
          </div>
        </div>
      </div>

      {props.showActions !== false && (
        <ActionButtons
          editBtnText={props.editBtnText}
          middleBtnText={props.middleBtnText}
          payBtnText={props.payBtnText}
          onEdit={props.onEdit}
          onMiddle={props.onMiddle}
          onPay={props.onPay}
          editBtnVariant={props.editBtnVariant}
          middleBtnVariant={props.middleBtnVariant}
          payBtnVariant={props.payBtnVariant}
          hideEditButton={props.hideEditButton}
          isEditLoading={props.isEditLoading}
          isMiddleLoading={props.isMiddleLoading}
          isPayLoading={props.isPayLoading}
        />
      )}
    </article>
  );
};

export default ExpertResponseCard;