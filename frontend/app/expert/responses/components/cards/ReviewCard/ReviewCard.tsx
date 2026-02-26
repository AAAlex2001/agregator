"use client";

import {
  StatusHeader,
  OrderSection,
  ExpertTerms,
  CommissionInfo,
  CommentSection,
  TechSpecFiles,
  ActionButtons,
} from "../../sections";
import type { ResponseBadge } from "../../types";
import styles from "./reviewCard.module.scss";

export interface ReviewCardProps {
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
  onWithdraw: () => void;
  onChangeOffer: () => void;
  isWithdrawLoading?: boolean;
  isEditLoading?: boolean;
}

export const ReviewCard = (props: ReviewCardProps) => {
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
            hideSum={false}
          />

          <div className={styles.infoSection}>
            <ExpertTerms
              deadline={props.deadline}
              costEstimate={props.costEstimate}
            />

            {props.orderComment && (
              <CommentSection
                commentTitle="Комментарий заказчика:"
                commentText={props.orderComment}
              />
            )}

            <CommissionInfo
              commissionText={props.commissionText}
              commissionAmount={props.commissionAmount}
              commissionStatus={props.commissionStatus}
              balanceReturnText={props.balanceReturnText}
              balanceReturnAmount={props.balanceReturnAmount}
            />

            {props.orderTechSpecFiles && props.orderTechSpecFiles.length > 0 && (
              <TechSpecFiles
                techSpecTitle="Файлы технического задания:"
                techSpecFiles={props.orderTechSpecFiles}
              />
            )}
          </div>
        </div>
      </div>

      <ActionButtons
        editBtnText="Отозвать отклик"
        editBtnVariant="outline"
        onEdit={props.onWithdraw}
        isEditLoading={props.isWithdrawLoading}
        payBtnText="Изменить предложение"
        payBtnVariant="outlineOrange"
        onPay={props.onChangeOffer}
        isPayLoading={props.isEditLoading}
      />
    </article>
  );
};
