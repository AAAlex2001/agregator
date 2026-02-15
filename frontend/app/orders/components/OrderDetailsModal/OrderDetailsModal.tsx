"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components";
import ResponseAnswerCard1 from "../ResponseAnswerCard1";
import { CommentSection, TechnicalSection, TopSection } from "./sections";
import type { OrderDetails } from "./types";
import styles from "./orderDetailsModal.module.scss";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  balance?: number;
  onRespond?: (order: OrderDetails) => void;
  onTopUp?: () => void;
  isResponding?: boolean;
}

type ModalStep = "details" | "respond";

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  balance = 150000,
  onRespond,
  onTopUp,
  isResponding = false,
}: OrderDetailsModalProps) {
  const [step, setStep] = useState<ModalStep>("details");

  useEffect(() => {
    setStep("details");
  }, [order?.id]);

  if (!isOpen || !order) {
    return null;
  }

  const handleClose = () => {
    setStep("details");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose} role="presentation">
      <div
        className={`${styles.modal} ${step === "respond" ? styles.modalRespond : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          ×
        </Button>

        {step === "details" && (
          <>
            <TopSection order={order} />
            <CommentSection comment={order.comment} />
            <TechnicalSection
              technicalFiles={order.technicalFiles}
              onRespond={() => setStep("respond")}
              isResponding={isResponding}
            />
          </>
        )}

        {step === "respond" && (
          <ResponseAnswerCard1
            order={order}
            balance={balance}
            onCancel={() => setStep("details")}
            onPay={() => onRespond?.(order)}
            onTopUp={() => onTopUp?.()}
          />
        )}
      </div>
    </div>
  );
}
