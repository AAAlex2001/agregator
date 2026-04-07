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
} from "../../sections";
import type { ResponseBadge } from "../../component-types";
import styles from "./acceptedCard.module.scss";

export interface AcceptedCardProps {
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
  deadline: string;
  costEstimate: string;
  commissionText: string;
  commissionAmount: string;
  commissionStatus?: string;
  balanceReturnText?: string;
  balanceReturnAmount?: string;
  commentTitle: string;
  commentText: string;
  orderComment?: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  orderTechSpecFiles?: string[];
  reminderText?: string;
  onReject: () => void;
  onChat: () => void;
  onShare?: () => void;
  isRejectLoading?: boolean;
  isChatLoading?: boolean;
}

export const AcceptedCard = (props: AcceptedCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <StatusHeader
          dateLabel={props.dateLabel}
          date={props.date}
          status={props.status}
          statusColor={props.statusColor}
          statusBg={props.statusBg}
        />

        <div className={styles.bottomContent}>
          <OrderSection
            orderTitle={props.orderTitle}
            customer={props.customer}
            orderDate={props.orderDate}
            badges={props.badges}
            sum={props.sum}
            collapsible={true}
          />

          <div className={styles.infoSection}>
            {(props.deadline || props.costEstimate) && (
              <ExpertTerms
                deadline={props.deadline}
                costEstimate={props.costEstimate}
              />
            )}

            {props.commentText && (
              <CommentSection
                commentTitle={props.commentTitle}
                commentText={props.commentText}
              />
            )}

            {props.orderComment && (
              <CommentSection
                commentTitle="Комментарий заказчика:"
                commentText={props.orderComment}
              />
            )}

            {props.commissionAmount && props.commissionAmount !== "0 ₽" && (
              <CommissionInfo
                commissionText={props.commissionText}
                commissionAmount={props.commissionAmount}
                commissionStatus={props.commissionStatus}
                balanceReturnText={props.balanceReturnText}
                balanceReturnAmount={props.balanceReturnAmount}
              />
            )}

            {props.techSpecFiles && props.techSpecFiles.length > 0 && (
              <TechSpecFiles
                techSpecTitle={props.techSpecTitle}
                techSpecFiles={props.techSpecFiles}
              />
            )}

            {props.orderTechSpecFiles && props.orderTechSpecFiles.length > 0 && (
              <TechSpecFiles
                techSpecTitle="Техническое задание:"
                techSpecFiles={props.orderTechSpecFiles}
              />
            )}

            {props.reminderText && (
              <ReminderSection reminderText={props.reminderText} />
            )}
          </div>
        </div>
      </div>

      <ActionButtons
        editBtnText="Отозвать отклик"
        editBtnVariant="outline"
        onEdit={props.onReject}
        isEditLoading={props.isRejectLoading}
        middleBtnText="Перейти в чат"
        middleBtnVariant="secondary"
        onMiddle={props.onChat}
        isMiddleLoading={props.isChatLoading}
        shareBtnText="Поделиться"
        onShare={props.onShare}
      />
    </article>
  );
};
