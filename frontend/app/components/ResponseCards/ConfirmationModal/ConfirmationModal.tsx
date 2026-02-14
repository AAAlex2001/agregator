"use client";

import Button from "@/app/components/Button";
import { StatusHeader, OrderSection } from "../sections";
import type { ResponseBadge } from "../types";
import styles from "./confirmationModal.module.scss";

export interface ConfirmationButton {
  text: string;
  variant: "primary" | "green" | "outlineOrange";
  onClick: () => void;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;

  showStatusHeader?: boolean;
  dateLabel?: string;
  date?: string;
  status?: string;
  statusColor?: string;
  statusBg?: string;
  statusMessage?: string;

  title: string;

  orderTitle: string;
  customer: string;
  orderDate: string;
  badges: ResponseBadge[];
  sum: string;

  warningTitle: string;
  warningItems: string[];

  buttons: ConfirmationButton[];
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  showStatusHeader,
  dateLabel,
  date,
  status,
  statusColor,
  statusBg,
  statusMessage,
  title,
  orderTitle,
  customer,
  orderDate,
  badges,
  sum,
  warningTitle,
  warningItems,
  buttons,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.content}>
          {showStatusHeader && dateLabel && date && status && statusColor && statusBg && (
            <StatusHeader
              dateLabel={dateLabel}
              date={date}
              status={status}
              statusColor={statusColor}
              statusBg={statusBg}
              statusMessage={statusMessage}
            />
          )}

          <h2 className={styles.title}>{title}</h2>

          <OrderSection
            orderTitle={orderTitle}
            customer={customer}
            orderDate={orderDate}
            badges={badges}
            sum={sum}
          />

          <div className={styles.warningBlock}>
            <span className={styles.warningTitle}>{warningTitle}</span>
            <ul className={styles.warningList}>
              {warningItems.map((item, index) => (
                <li key={index} className={styles.warningItem}>
                  <span className={styles.rhombus} />
                  <span className={styles.warningText}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          {buttons.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              size="sm"
              fullWidth
              onClick={btn.onClick}
            >
              {btn.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
