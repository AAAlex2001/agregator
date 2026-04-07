"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import ResponseAnswerCard1 from "@/features/order/respond/ui/ResponseAnswerCard1";
import ResponseAnswerCard2 from "@/features/order/respond/ui/ResponseAnswerCard2";
import { CommentSection, TechnicalSection, TopSection } from "./sections";
import type { OrderDetails, Step2FormData, Step2InitialData } from "./types";
import styles from "./orderDetailsModal.module.scss";

export type ModalStep = "details" | "step1" | "step2";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  balance?: number;
  onRespond?: (order: OrderDetails, formData: Step2FormData) => void;
  onTopUp?: (amount: number) => void | Promise<void>;
  isResponding?: boolean;
  initialStep?: ModalStep;
  initialData?: Step2InitialData;
  submitLabel?: string;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  balance = 150000,
  onRespond,
  onTopUp,
  isResponding = false,
  initialStep = "details",
  initialData,
  submitLabel,
}: OrderDetailsModalProps) {
  const [step, setStep] = useState<ModalStep>(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [order?.id, initialStep]);

  if (!isOpen || !order) {
    return null;
  }

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
              responsesDeadline={order.responsesDeadline}
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
            onTopUp={() => void onTopUp?.(order.commissionAmountRaw)}
          />
        )}

        {step === "step2" && (
          <ResponseAnswerCard2
            order={order}
            onCancel={() => setStep("step1")}
            onSubmit={(formData) => onRespond?.(order, formData)}
            isSubmitting={isResponding}
            initialData={initialData}
            submitLabel={submitLabel}
          />
        )}

      </div>
    </div>
  );
}
