"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components";
import ResponseAnswerCard1 from "../ResponseAnswerCard1";
import ResponseAnswerCard2 from "../ResponseAnswerCard2";
import { CommentSection, TechnicalSection, TopSection } from "./sections";
import type { OrderDetails, Step2FormData } from "./types";
import styles from "./orderDetailsModal.module.scss";

function parseSumToNumber(sum: string): number {
  const cleaned = sum.replace(/[^\d.,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  balance?: number;
  onRespond?: (order: OrderDetails, formData: Step2FormData) => void;
  onTopUp?: () => void;
  isResponding?: boolean;
}

type ModalStep = "details" | "step1" | "step2";

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

  const commission = Math.ceil(parseSumToNumber(order.sum) * 0.05);

  const handleClose = () => {
    setStep("details");
    onClose();
  };

  const modalClass = [
    styles.modal,
    step === "step1" ? styles.modalRespond : "",
    step === "step2" ? styles.modalStep2 : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.overlay} onClick={handleClose} role="presentation">
      <div
        className={modalClass}
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
              onRespond={() => setStep("step1")}
              isResponding={isResponding}
            />
          </>
        )}

        {step === "step1" && (
          <ResponseAnswerCard1
            order={order}
            balance={balance}
            onCancel={() => setStep("details")}
            onPay={() => setStep("step2")}
            onTopUp={() => onTopUp?.()}
          />
        )}

        {step === "step2" && (
          <ResponseAnswerCard2
            order={order}
            commission={commission}
            onCancel={() => setStep("step1")}
            onSubmit={(formData) => onRespond?.(order, formData)}
            isSubmitting={isResponding}
          />
        )}
      </div>
    </div>
  );
}
