"use client";

import { useRef, useState } from "react";
import { useNotifications } from "@/app/components/Notifications";
import { mergeFilesWithLimits } from "@/app/utils/fileUploadValidation";
import type { OrderDetails, Step2FormData, Step2InitialData } from "../OrderDetailsModal/types";
import { OrderSummary } from "../ResponseAnswerCard1/sections";
import {
  CommissionConfirm,
  CommentField,
  FileUploadSection,
  HeaderRow,
  InputFields,
} from "./sections";
import styles from "./responseAnswerCard2.module.scss";

function parseRuDate(ddmmyyyy: string): Date | null {
  const parts = ddmmyyyy.split(".");
  if (parts.length !== 3) return null;
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

interface ResponseAnswerCard2Props {
  order: OrderDetails;
  onCancel: () => void;
  onSubmit: (data: Step2FormData) => void;
  isSubmitting: boolean;
  initialData?: Step2InitialData;
  submitLabel?: string;
}

export default function ResponseAnswerCard2({
  order,
  onCancel,
  onSubmit,
  isSubmitting,
  initialData,
  submitLabel,
}: ResponseAnswerCard2Props) {
  const { showError } = useNotifications();
  const [deadline, setDeadline] = useState(initialData?.deadline ?? "");
  const [costEstimate, setCostEstimate] = useState(initialData?.costEstimate ?? "");
  const [comment, setComment] = useState(initialData?.comment ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>(initialData?.existingFiles ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsedCost = Number(costEstimate.replace(/\s/g, "").replace(",", "."));
  const isEditMode = Boolean(initialData);
  const canSubmit = isEditMode || (deadline.trim() !== "" && parsedCost > 0);

  const handleSubmit = () => {
    if (isSubmitting) return;

    const costKopecks = Math.round(parsedCost * 100);
    if (order.sumAmountRaw > 0 && costKopecks > order.sumAmountRaw) {
      showError("Стоимость не может превышать бюджет заказчика");
      return;
    }

    const orderDeadline = parseRuDate(order.deadlineRaw);
    const proposedDeadline = deadline ? new Date(deadline) : null;
    if (orderDeadline && proposedDeadline && proposedDeadline > orderDeadline) {
      showError("Срок не может быть позже дедлайна заказчика");
      return;
    }

    onSubmit({
      deadline,
      costEstimate: costKopecks,
      comment,
      files,
      keepFiles: existingFiles,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files
      ? Array.from(event.currentTarget.files)
      : [];

    if (selectedFiles.length > 0) {
      setFiles((prev) => {
        const result = mergeFilesWithLimits(prev, selectedFiles);
        if (result.errorMessage) {
          showError(result.errorMessage);
          return prev;
        }
        return result.nextFiles;
      });
    }

    event.currentTarget.value = "";
  };

  return (
    <div className={styles.card}>
      <HeaderRow 
        title={isEditMode ? "Изменение отклика" : "Отклик на заказ"} 
        step={isEditMode ? "" : "Шаг 2. Дополнение заявки"} 
        dateLabel={initialData?.dateLabel}
        date={initialData?.date}
        status={initialData?.status}
        statusColor={initialData?.statusColor}
        statusBg={initialData?.statusBg}
      />
      <OrderSummary
        title={order.title}
        customer={order.customer}
        date={order.date}
        badges={order.badges}
        sum={order.sum}
      />
      <CommissionConfirm commissionDisplay={order.commissionAmount} />
      <InputFields
        deadline={deadline}
        onDeadlineChange={setDeadline}
        costEstimate={costEstimate}
        onCostEstimateChange={setCostEstimate}
      />
      <CommentField comment={comment} onCommentChange={setComment} />
      <FileUploadSection
        files={files}
        existingFiles={existingFiles}
        onAddFile={() => {
          if (!fileInputRef.current) {
            return;
          }
          fileInputRef.current.value = "";
          fileInputRef.current.click();
        }}
        onRemoveFile={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
        onRemoveExistingFile={(index) => setExistingFiles((prev) => prev.filter((_, i) => i !== index))}
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpeg,.jpg,.png,.doc,.docx,.xls,.xlsx"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: 0,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        tabIndex={-1}
        onChange={handleFileChange}
      />
    </div>
  );
}
