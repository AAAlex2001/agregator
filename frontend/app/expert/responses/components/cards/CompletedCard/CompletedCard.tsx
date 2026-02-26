"use client";

import {
  StatusHeader,
  OrderSection,
  ExpertTerms,
  CommissionInfo,
  CommentSection,
  TechSpecFiles,
} from "../../sections";
import type { ResponseBadge } from "../../types";
import styles from "./completedCard.module.scss";

export interface CompletedCardProps {
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
}

export const CompletedCard = (props: CompletedCardProps) => {
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
          </div>
        </div>
      </div>
    </article>
  );
};
