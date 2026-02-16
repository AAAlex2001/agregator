"use client";

import {
  StatusHeader,
  OrderSection,
  ExpertTerms,
  CommissionInfo,
  CommentSection,
  TechSpecFiles,
  ReminderSection,
  ActionButtons,
} from "../sections";
import type { ResponseBadge } from "../types";
import styles from "./responseCard.module.scss";

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
  payBtnText?: string;
  onEdit?: () => void;
  onPay?: () => void;
  showActions?: boolean;
  editBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  payBtnVariant?: "outline" | "outlineOrange" | "secondary" | "primary" | "green";
  hideEditButton?: boolean;
  isEditLoading?: boolean;
  isPayLoading?: boolean;
}

const ResponseCard = (props: ResponseCardProps) => {
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

        <div className={styles.bottomContent}>
          <OrderSection
            orderTitle={props.orderTitle}
            customer={props.customer}
            orderDate={props.orderDate}
            badges={props.badges}
            sum={props.sum}
            collapsible={props.collapsibleOrderMeta}
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
          payBtnText={props.payBtnText}
          onEdit={props.onEdit}
          onPay={props.onPay}
          editBtnVariant={props.editBtnVariant}
          payBtnVariant={props.payBtnVariant}
          hideEditButton={props.hideEditButton}
          isEditLoading={props.isEditLoading}
          isPayLoading={props.isPayLoading}
        />
      )}
    </article>
  );
};

export default ResponseCard;
