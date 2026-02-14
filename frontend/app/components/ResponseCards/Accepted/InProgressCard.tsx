"use client";

import Button from "@/app/components/Button";
import {
  StatusHeader,
  OrderSection,
  ExpertTerms,
  CommissionInfo,
  CommentSection,
  TechSpecFiles,
} from "../sections";
import type { ResponseBadge } from "../types";
import styles from "./accepted.module.scss";

export interface InProgressCardProps {
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
  editBtnText?: string;
  completeBtnText?: string;
  onEdit?: () => void;
  onComplete?: () => void;
}

const InProgressCard = (props: InProgressCardProps) => {
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
          />

          <div className={styles.infoSection}>
            <ExpertTerms
              deadline={props.deadline}
              costEstimate={props.costEstimate}
            />
            <CommentSection
              commentTitle={props.commentTitle}
              commentText={props.commentText}
            />
            <TechSpecFiles
              techSpecTitle={props.techSpecTitle}
              techSpecFiles={props.techSpecFiles}
            />
          </div>
        </div>

        <CommissionInfo
          commissionText={props.commissionText}
          commissionAmount={props.commissionAmount}
          commissionStatus={props.commissionStatus}
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="sm" fullWidth onClick={props.onEdit}>
          {props.editBtnText || "Редактировать"}
        </Button>
        <Button variant="green" size="sm" fullWidth onClick={props.onComplete}>
          {props.completeBtnText || "Завершить работу"}
        </Button>
      </div>
    </article>
  );
};

export default InProgressCard;
