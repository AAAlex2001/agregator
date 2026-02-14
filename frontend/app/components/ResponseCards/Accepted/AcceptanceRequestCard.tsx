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

export interface AcceptanceRequestCardProps {
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
  techSpecTitle?: string;
  techSpecFiles?: string[];
  confirmDeadline?: string;
  declineBtnText?: string;
  editBtnText?: string;
  confirmBtnText?: string;
  onDecline?: () => void;
  onEdit?: () => void;
  onConfirm?: () => void;
}

const AcceptanceRequestCard = (props: AcceptanceRequestCardProps) => {
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

        <div className={styles.balanceSection}>
          <CommissionInfo
            commissionText={props.commissionText}
            commissionAmount={props.commissionAmount}
            commissionStatus={props.commissionStatus}
            balanceReturnText={props.balanceReturnText}
            balanceReturnAmount={props.balanceReturnAmount}
          />
          {props.confirmDeadline && (
            <span className={styles.confirmDeadline}>
              {props.confirmDeadline}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="transparent" size="sm" fullWidth onClick={props.onDecline}>
          {props.declineBtnText || "Отклонить"}
        </Button>
        <Button variant="secondary" size="sm" fullWidth onClick={props.onEdit}>
          {props.editBtnText || "Редактировать"}
        </Button>
        <Button variant="green" size="sm" fullWidth onClick={props.onConfirm}>
          {props.confirmBtnText || "Подтвердить заказ"}
        </Button>
      </div>
    </article>
  );
};

export default AcceptanceRequestCard;
