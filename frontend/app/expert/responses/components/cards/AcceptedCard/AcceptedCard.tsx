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
import type { ResponseBadge } from "../../types";
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
  commentTitle: string;
  commentText: string;
  orderComment?: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  reminderText?: string;
  onReject: () => void;
  onChat: () => void;
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
            <ExpertTerms
              deadline={props.deadline}
              costEstimate={props.costEstimate}
            />

            {props.orderComment && (
              <CommentSection
                title="Комментарий заказчика:"
                text={props.orderComment}
              />
            )}

            {props.commentText && (
              <CommentSection
                title={props.commentTitle}
                text={props.commentText}
              />
            )}

            {props.techSpecFiles && props.techSpecFiles.length > 0 && (
              <TechSpecFiles
                title={props.techSpecTitle}
                files={props.techSpecFiles}
              />
            )}

            <CommissionInfo
              text={props.commissionText}
              amount={props.commissionAmount}
              status={props.commissionStatus}
            />

            {props.reminderText && (
              <ReminderSection text={props.reminderText} />
            )}
          </div>
        </div>
      </div>

      <ActionButtons
        editBtnText="Отклонить"
        editBtnVariant="outline"
        onEdit={props.onReject}
        isEditLoading={props.isRejectLoading}
        middleBtnText="Перейти в чат"
        middleBtnVariant="secondary"
        onMiddle={props.onChat}
        isMiddleLoading={props.isChatLoading}
      />
    </article>
  );
};
