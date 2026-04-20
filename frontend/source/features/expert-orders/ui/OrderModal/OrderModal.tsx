"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/shared/ui/Notifications";
import { mergeFilesWithLimits } from "@/shared/lib/fileUploadValidation";
import { DetailsStep } from "./DetailsStep";
import { OfferStep } from "./OfferStep";
import { TenderStep } from "./TenderStep";
import type { ModalStep, OrderModalProps } from "./types";
import styles from "./OrderModal.module.scss";

function parseDeadline(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function OrderModal({
  isOpen,
  onClose,
  order,
  balance,
  onRespond,
  isResponding,
  initialStep = "details",
}: OrderModalProps) {
  const { showError } = useNotifications();
  const [step, setStep] = useState<ModalStep>(initialStep);
  const [deadline, setDeadline] = useState("");
  const [cost, setCost] = useState("");
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setStep(initialStep);
    setDeadline("");
    setCost("");
    setComment("");
    setFiles([]);
  }, [order?.id, initialStep]);

  if (!isOpen || !order) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleCostChange = (value: string) => {
    setCost(value.replace(/[^0-9]/g, ""));
  };

  const handleAddFiles = (nextFiles: FileList | null) => {
    if (!nextFiles || nextFiles.length === 0) {
      return;
    }

    const result = mergeFilesWithLimits(files, Array.from(nextFiles));
    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }

    setFiles(result.nextFiles);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = () => {
    if (isResponding) {
      return;
    }

    const costAmount = Math.round(Number(cost) * 100);
    if (order.sumAmountRaw > 0 && costAmount > order.sumAmountRaw) {
      showError("Стоимость не может превышать бюджет заказчика");
      return;
    }

    const customerDeadline = parseDeadline(order.deadlineRaw);
    const offerDeadline = parseDeadline(deadline);
    if (customerDeadline && offerDeadline && offerDeadline > customerDeadline) {
      showError("Срок не может быть позже дедлайна заказчика");
      return;
    }

    onRespond(order, {
      deadline,
      costAmount,
      comment,
      files,
    });
  };

  return (
    <div className={styles.overlay} onClick={handleClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        {step === "details" && (
          <DetailsStep order={order} onRespond={() => setStep("tender")} />
        )}

        {step === "tender" && (
          <TenderStep
            order={order}
            balance={balance}
            onBack={() => setStep("details")}
            onContinue={() => setStep("offer")}
          />
        )}

        {step === "offer" && (
          <OfferStep
            order={order}
            deadline={deadline}
            cost={cost}
            comment={comment}
            files={files}
            isSubmitting={isResponding}
            onDeadlineChange={setDeadline}
            onCostChange={handleCostChange}
            onCommentChange={setComment}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onBack={() => setStep("tender")}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
