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
import type { ResponseBadge } from "../../component-types";
import styles from "./rejectedCard.module.scss";

export interface RejectedCardProps {
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
  techSpecTitle?: string;
  techSpecFiles?: string[];
  onShare?: () => void;
}

export const RejectedCard = (props: RejectedCardProps) => {
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

            {props.commentText && (
              <CommentSection
                commentTitle={props.commentTitle}
                commentText={props.commentText}
              />
            )}

            {props.techSpecFiles && props.techSpecFiles.length > 0 && (
              <TechSpecFiles
                techSpecTitle={props.techSpecTitle}
                techSpecFiles={props.techSpecFiles}
              />
            )}

            <CommissionInfo
              commissionText={props.commissionText}
              commissionAmount={props.commissionAmount}
              commissionStatus={props.commissionStatus}
            />
          </div>
        </div>
      </div>

      <ActionButtons
        shareBtnText="Поделиться"
        onShare={props.onShare}
      />
    </article>
  );
};
