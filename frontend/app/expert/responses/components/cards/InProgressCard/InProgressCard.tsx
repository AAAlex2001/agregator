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
import styles from "./inProgressCard.module.scss";

export interface InProgressCardProps {
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
  orderComment?: string;
  techSpecTitle?: string;
  techSpecFiles?: string[];
  orderTechSpecFiles?: string[];
  reminderText?: string;
  expertConfirmed?: boolean;
  onReject: () => void;
  onChat: () => void;
  onAcceptProject?: () => void;
  onComplete?: () => void;
  isRejectLoading?: boolean;
  isChatLoading?: boolean;
  isAcceptProjectLoading?: boolean;
  isCompleteLoading?: boolean;
}

export const InProgressCard = (props: InProgressCardProps) => {
  const confirmed = props.expertConfirmed ?? false;

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

            {props.commissionAmount && props.commissionAmount !== "0 ₽" && (
              <CommissionInfo
                commissionText={props.commissionText}
                commissionAmount={props.commissionAmount}
                commissionStatus={props.commissionStatus}
                balanceReturnText={!confirmed ? props.balanceReturnText : undefined}
                balanceReturnAmount={!confirmed ? props.balanceReturnAmount : undefined}
              />
            )}

            {props.reminderText && (
              <ReminderSection reminderText={props.reminderText} />
            )}
          </div>
        </div>
      </div>

      {!confirmed ? (
        <ActionButtons
          editBtnText="Отклонить"
          editBtnVariant="outline"
          onEdit={props.onReject}
          isEditLoading={props.isRejectLoading}
          middleBtnText="Перейти в чат"
          middleBtnVariant="secondary"
          onMiddle={props.onChat}
          isMiddleLoading={props.isChatLoading}
          payBtnText="Принять проект"
          payBtnVariant="green"
          onPay={props.onAcceptProject}
          isPayLoading={props.isAcceptProjectLoading}
        />
      ) : (
        <ActionButtons
          payBtnText="Перейти в чат"
          payBtnVariant="secondary"
          onPay={props.onChat}
          isPayLoading={props.isChatLoading}
        />
      )}
    </article>
  );
};
